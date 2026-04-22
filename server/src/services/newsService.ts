import { ONTARIO_CITY_ALIASES, ONTARIO_OFFICIAL_SOURCE_CONFIGS, type OfficialSourceConfig } from "../data/ontarioOfficialNewsSources";

export type NewsArticle = {
  title: string;
  description: string | null;
  url: string;
  source: string;
  publishedAt: string;
  urlToImage: string | null;
  sourceType: "official" | "media";
};

type NewsSearchOptions = {
  location?: string;
  city?: string;
  state?: string;
  country?: string;
};

type ArticleCandidate = {
  titleHint: string;
  url: string;
  lastmod?: string;
};

type CachedNewsResult = {
  expiresAt: number;
  articles: NewsArticle[];
};

const NEWS_CACHE_TTL_MS = 10 * 60 * 1000;
const FETCH_TIMEOUT_MS = 3500;
const MAX_SITEMAP_URLS_PER_SOURCE = 2;
const MAX_LISTING_URLS_PER_SOURCE = 3;
const MAX_CANDIDATES_PER_SOURCE = 24;
const MAX_ARTICLES_PER_SOURCE = 6;
const ARTICLE_PARSE_BATCH_SIZE = 4;
const MAX_TOTAL_ARTICLES = 15;
const MEDIA_SEARCH_TERMS = ["fraud", "scam", "phishing", "\"identity theft\"", "cybercrime"];
const TRUSTED_MEDIA_SEARCH_GROUPS = [
  ["ctvnews.ca", "cp24.com", "globalnews.ca", "cbc.ca"],
  ["citynews.ca", "thestar.com", "therecord.com", "ottawacitizen.com"],
];

const newsCache = new Map<string, CachedNewsResult>();
const inflightNewsRequests = new Map<string, Promise<NewsArticle[]>>();

const FRAUD_KEYWORDS = [
  "fraud",
  "scam",
  "phishing",
  "identity theft",
  "cybercrime",
  "cyber crime",
  "online scam",
  "online fraud",
  "romance scam",
  "bank scam",
  "grandparent scam",
  "emergency scam",
  "extortion",
  "spoofing",
];

function normalizeText(value: string): string {
  return value.toLowerCase().replace(/\s+/g, " ").trim();
}

function decodeHtml(value: string): string {
  return value
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, "\"")
    .replace(/&#39;|&apos;/gi, "'")
    .replace(/&nbsp;/gi, " ")
    .replace(/&ndash;/gi, "-")
    .replace(/&mdash;/gi, "-")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">");
}

function stripHtml(value: string): string {
  return decodeHtml(value.replace(/<script[\s\S]*?<\/script>/gi, " ").replace(/<style[\s\S]*?<\/style>/gi, " ").replace(/<[^>]+>/g, " "))
    .replace(/\s+/g, " ")
    .trim();
}

function extractFirstMatch(html: string, pattern: RegExp): string | null {
  const match = html.match(pattern);
  return match?.[1] ? decodeHtml(match[1]).trim() : null;
}

function extractMetaContent(html: string, key: string): string | null {
  const escapedKey = key.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return extractFirstMatch(
    html,
    new RegExp(`<meta[^>]+(?:name|property)=["']${escapedKey}["'][^>]+content=["']([^"']+)["'][^>]*>`, "i"),
  );
}

function extractParagraphs(html: string): string[] {
  return Array.from(html.matchAll(/<p\b[^>]*>([\s\S]*?)<\/p>/gi))
    .map((match) => stripHtml(match[1]))
    .filter((paragraph) => paragraph.length > 40);
}

function extractDateValue(html: string): string | null {
  return (
    extractMetaContent(html, "article:published_time") ||
    extractMetaContent(html, "og:published_time") ||
    extractFirstMatch(html, /<time[^>]+datetime=["']([^"']+)["']/i) ||
    extractFirstMatch(html, /Posted on:\s*<\/[^>]+>\s*([^<]+)/i)
  );
}

function looksLikeFraudNews(text: string): boolean {
  const normalized = normalizeText(text);
  return FRAUD_KEYWORDS.some((keyword) => normalized.includes(keyword));
}

function getLocationAliases(city: string, extraAliases: string[] = []): string[] {
  const normalizedCity = normalizeText(city);
  const baseAliases = ONTARIO_CITY_ALIASES[normalizedCity] ?? [normalizedCity];
  return [...new Set([...baseAliases, ...extraAliases.map((alias) => normalizeText(alias))])];
}

function matchesLocation(text: string, city: string, extraAliases: string[] = []): boolean {
  const normalizedText = normalizeText(text);
  return getLocationAliases(city, extraAliases).some((alias) => normalizedText.includes(alias));
}

function toAbsoluteUrl(href: string, listingUrl: string): string | null {
  try {
    return new URL(href, listingUrl).toString();
  } catch {
    return null;
  }
}

function isAllowedArticleUrl(articleUrl: string, config: OfficialSourceConfig): boolean {
  try {
    const parsed = new URL(articleUrl);
    if (!config.allowedHosts.includes(parsed.host)) {
      return false;
    }

    const matchers = config.articlePathMatchers ?? [];
    if (matchers.length === 0) {
      return true;
    }

    const pathWithSearch = `${parsed.pathname}${parsed.search}`;
    return matchers.some((matcher) => matcher.test(pathWithSearch));
  } catch {
    return false;
  }
}

function extractCandidateLinks(html: string, config: OfficialSourceConfig, listingUrl: string): ArticleCandidate[] {
  const candidates: ArticleCandidate[] = [];

  for (const match of html.matchAll(/<a\b[^>]*href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi)) {
    const href = match[1];
    const titleHint = stripHtml(match[2]);
    const absoluteUrl = toAbsoluteUrl(href, listingUrl);

    if (!absoluteUrl || !titleHint) {
      continue;
    }

    if (!isAllowedArticleUrl(absoluteUrl, config)) {
      continue;
    }

    if (!/\/news\b|\/news-feed\/posts\/|newsId=/i.test(absoluteUrl)) {
      continue;
    }

    candidates.push({ titleHint, url: absoluteUrl });
  }

  return candidates.filter(
    (candidate, index, allCandidates) => allCandidates.findIndex((item) => item.url === candidate.url) === index,
  );
}

async function fetchHtml(url: string): Promise<string> {
  return fetchText(url, "text/html,application/xhtml+xml");
}

async function fetchXml(url: string): Promise<string> {
  return fetchText(url, "application/rss+xml,application/xml,text/xml,text/plain,*/*");
}

async function fetchText(url: string, accept: string): Promise<string> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

  try {
    const response = await fetch(url, {
      headers: {
        "user-agent": "Mozilla/5.0 AIScamDetectionApp News Fetcher",
        accept,
      },
      signal: controller.signal,
    });

    if (!response.ok) {
      throw new Error(`Unable to fetch ${url}: ${response.status}`);
    }

    return response.text();
  } finally {
    clearTimeout(timeout);
  }
}

function getCachedNews(cacheKey: string): NewsArticle[] | null {
  const cached = newsCache.get(cacheKey);
  if (!cached) {
    return null;
  }

  if (cached.expiresAt <= Date.now()) {
    newsCache.delete(cacheKey);
    return null;
  }

  return cached.articles;
}

function setCachedNews(cacheKey: string, articles: NewsArticle[]) {
  newsCache.set(cacheKey, {
    articles,
    expiresAt: Date.now() + NEWS_CACHE_TTL_MS,
  });
}

function chunkArray<T>(items: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let index = 0; index < items.length; index += size) {
    chunks.push(items.slice(index, index + size));
  }
  return chunks;
}

function getLocationCacheKey(options: NewsSearchOptions): string | null {
  const city = options.location?.trim() || options.city?.trim() || "";
  if (!city) {
    return null;
  }

  return normalizeText(`v2|${city}|${options.state?.trim() ?? ""}|${options.country?.trim() ?? ""}`);
}

function cleanXmlValue(value: string | null): string | null {
  if (!value) {
    return null;
  }

  return decodeHtml(value.replace(/<!\[CDATA\[([\s\S]*?)\]\]>/gi, "$1")).trim();
}

function extractXmlTagValue(xml: string, tagName: string): string | null {
  return cleanXmlValue(extractFirstMatch(xml, new RegExp(`<${tagName}\\b[^>]*>([\\s\\S]*?)<\\/${tagName}>`, "i")));
}

function extractXmlAttribute(xml: string, tagName: string, attributeName: string): string | null {
  const escapedTag = tagName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const escapedAttr = attributeName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return cleanXmlValue(
    extractFirstMatch(
      xml,
      new RegExp(`<${escapedTag}\\b[^>]*${escapedAttr}=["']([^"']+)["'][^>]*\\/?>`, "i"),
    ),
  );
}

function buildGoogleNewsSearchUrl(city: string, siteFilters: string[]): string {
  const locationQuery = getLocationAliases(city)
    .slice(0, 4)
    .map((alias) => `"${alias}"`)
    .join(" OR ");
  const keywordQuery = MEDIA_SEARCH_TERMS.join(" OR ");
  const siteQuery = siteFilters.map((domain) => `site:${domain}`).join(" OR ");
  const query = `(${locationQuery}) (${keywordQuery}) (${siteQuery}) when:365d`;

  return `https://news.google.com/rss/search?q=${encodeURIComponent(query)}&hl=en-CA&gl=CA&ceid=CA:en`;
}

function extractSourceFromTitle(title: string): string | null {
  const parts = title.split(" - ").map((part) => part.trim()).filter(Boolean);
  return parts.length > 1 ? parts[parts.length - 1] : null;
}

function trimSourceSuffix(title: string, source: string | null): string {
  if (!source) {
    return title;
  }

  const suffix = ` - ${source}`;
  return title.endsWith(suffix) ? title.slice(0, -suffix.length).trim() : title;
}

function extractRssArticles(xml: string, city: string): NewsArticle[] {
  return Array.from(xml.matchAll(/<item\b[^>]*>([\s\S]*?)<\/item>/gi))
    .flatMap((match) => {
      const itemXml = match[1];
      const rawTitle = extractXmlTagValue(itemXml, "title");
      const url = extractXmlTagValue(itemXml, "link");
      const rawDescription = extractXmlTagValue(itemXml, "description");
      const publishedAt =
        extractXmlTagValue(itemXml, "pubDate") ||
        extractXmlTagValue(itemXml, "published") ||
        new Date().toISOString();
      const source =
        extractXmlTagValue(itemXml, "source") ||
        extractSourceFromTitle(rawTitle ?? "") ||
        "Trusted media";
      const title = trimSourceSuffix(rawTitle ?? "", source);
      const description = rawDescription ? stripHtml(rawDescription) : null;
      const urlToImage =
        extractXmlAttribute(itemXml, "media:content", "url") ||
        extractXmlAttribute(itemXml, "media:thumbnail", "url") ||
        extractXmlAttribute(itemXml, "enclosure", "url");
      const relevanceText = `${title} ${description ?? ""}`;

      if (!title || !url) {
        return [];
      }

      if (!looksLikeFraudNews(relevanceText)) {
        return [];
      }

      if (!matchesLocation(relevanceText, city)) {
        return [];
      }

      return [{
        title,
        description,
        url,
        source,
        publishedAt,
        urlToImage,
        sourceType: "media" as const,
      }];
    })
    .sort((left, right) => new Date(right.publishedAt).getTime() - new Date(left.publishedAt).getTime());
}

function getArticleDedupKey(article: NewsArticle): string {
  return normalizeText(`${article.source}|${article.title}`);
}

async function getTrustedMediaNews(city: string): Promise<NewsArticle[]> {
  const results = await Promise.all(
    TRUSTED_MEDIA_SEARCH_GROUPS.map(async (siteFilters) => {
      try {
        const rss = await fetchXml(buildGoogleNewsSearchUrl(city, siteFilters));
        return extractRssArticles(rss, city);
      } catch {
        return [];
      }
    }),
  );

  return results
    .flat()
    .filter((article, index, allArticles) => allArticles.findIndex((item) => getArticleDedupKey(item) === getArticleDedupKey(article)) === index)
    .slice(0, MAX_TOTAL_ARTICLES);
}

function prioritizeCandidates(candidates: ArticleCandidate[]): ArticleCandidate[] {
  return candidates
    .filter((candidate, index, allCandidates) => allCandidates.findIndex((item) => item.url === candidate.url) === index)
    .sort((left, right) => {
      const rightTime = right.lastmod ? new Date(right.lastmod).getTime() : 0;
      const leftTime = left.lastmod ? new Date(left.lastmod).getTime() : 0;
      const fraudPriority = Number(looksLikeFraudNews(right.titleHint)) - Number(looksLikeFraudNews(left.titleHint));
      return fraudPriority || rightTime - leftTime;
    })
    .slice(0, MAX_CANDIDATES_PER_SOURCE);
}

async function fetchCandidatesFromSitemaps(config: OfficialSourceConfig): Promise<ArticleCandidate[]> {
  const sitemapUrls = (config.sitemapUrls ?? []).slice(0, MAX_SITEMAP_URLS_PER_SOURCE);
  const sitemapCandidates = await Promise.all(
    sitemapUrls.map(async (sitemapUrl) => {
      try {
        const xml = await fetchXml(sitemapUrl);
        return extractSitemapCandidates(xml, config);
      } catch {
        return [];
      }
    }),
  );

  return sitemapCandidates.flat();
}

async function fetchCandidatesFromListings(config: OfficialSourceConfig): Promise<ArticleCandidate[]> {
  const listingUrls = config.listingUrls.slice(0, MAX_LISTING_URLS_PER_SOURCE);
  const listingCandidates = await Promise.all(
    listingUrls.map(async (listingUrl) => {
      try {
        const html = await fetchHtml(listingUrl);
        return extractCandidateLinks(html, config, listingUrl);
      } catch {
        return [];
      }
    }),
  );

  return listingCandidates.flat();
}

function extractSitemapCandidates(xml: string, config: OfficialSourceConfig): ArticleCandidate[] {
  const entries: ArticleCandidate[] = Array.from(xml.matchAll(/<url>([\s\S]*?)<\/url>/gi))
    .flatMap((match) => {
      const url = extractFirstMatch(match[1], /<loc>([\s\S]*?)<\/loc>/i);
      const lastmod = extractFirstMatch(match[1], /<lastmod>([\s\S]*?)<\/lastmod>/i) || undefined;
      return url ? [{ titleHint: "", url, lastmod }] : [];
    })
    .filter((entry) => isAllowedArticleUrl(entry.url, config))
    .map((entry) => ({ titleHint: entry.titleHint, url: entry.url, lastmod: entry.lastmod }));

  return entries.filter(
    (candidate, index, allCandidates) => allCandidates.findIndex((item) => item.url === candidate.url) === index,
  );
}

async function extractCandidatesFromSource(config: OfficialSourceConfig): Promise<ArticleCandidate[]> {
  const sitemapCandidates = await fetchCandidatesFromSitemaps(config);

  if (sitemapCandidates.length >= MAX_CANDIDATES_PER_SOURCE) {
    return prioritizeCandidates(sitemapCandidates);
  }

  const listingCandidates = await fetchCandidatesFromListings(config);
  return prioritizeCandidates([...sitemapCandidates, ...listingCandidates]);
}

async function parseOfficialArticle(candidate: ArticleCandidate, config: OfficialSourceConfig, city: string): Promise<NewsArticle | null> {
  try {
    const html = await fetchHtml(candidate.url);
    const paragraphs = extractParagraphs(html);
    const title = extractMetaContent(html, "og:title") || extractFirstMatch(html, /<title>([\s\S]*?)<\/title>/i) || candidate.titleHint;
    const description =
      extractMetaContent(html, "description") ||
      extractMetaContent(html, "og:description") ||
      paragraphs[0] ||
      null;
    const publishedAt = extractDateValue(html) || candidate.lastmod || new Date().toISOString();
    const urlToImage = extractMetaContent(html, "og:image");
    const relevanceText = `${title} ${description ?? ""} ${paragraphs.slice(0, 3).join(" ")}`;

    if (!looksLikeFraudNews(relevanceText)) {
      return null;
    }

    if (!matchesLocation(relevanceText, city, config.regionalAliases ?? [])) {
      return null;
    }

    return {
      title,
      description,
      url: candidate.url,
      source: config.sourceName,
      publishedAt,
      urlToImage,
      sourceType: "official",
    };
  } catch {
    return null;
  }
}

function resolveOfficialSources(city: string): OfficialSourceConfig[] {
  const normalizedCity = normalizeText(city);
  const matchedConfigs = ONTARIO_OFFICIAL_SOURCE_CONFIGS.filter((config) => config.supportedCities.includes(normalizedCity));
  return matchedConfigs.length > 0 ? matchedConfigs : ONTARIO_OFFICIAL_SOURCE_CONFIGS;
}

async function getOfficialLocalNews(city: string): Promise<NewsArticle[]> {
  const sourceConfigs = resolveOfficialSources(city);
  if (sourceConfigs.length === 0) {
    return [];
  }

  const results = await Promise.all(
    sourceConfigs.map(async (config) => {
      const candidates = await extractCandidatesFromSource(config);
      const articles: NewsArticle[] = [];

      for (const batch of chunkArray(candidates, ARTICLE_PARSE_BATCH_SIZE)) {
        const parsedArticles = await Promise.all(
          batch.map((candidate) => parseOfficialArticle(candidate, config, city)),
        );

        for (const article of parsedArticles) {
          if (article) {
            articles.push(article);
          }

          if (articles.length >= MAX_ARTICLES_PER_SOURCE) {
            break;
          }
        }

        if (articles.length >= MAX_ARTICLES_PER_SOURCE) {
          break;
        }
      }

      return articles;
    }),
  );

  return results
    .flat()
    .filter((article, index, allArticles) => allArticles.findIndex((item) => getArticleDedupKey(item) === getArticleDedupKey(article)) === index)
    .sort((left, right) => new Date(right.publishedAt).getTime() - new Date(left.publishedAt).getTime())
    .slice(0, MAX_TOTAL_ARTICLES);
}

export async function getCyberFraudNews(options: NewsSearchOptions = {}): Promise<NewsArticle[]> {
  const searchCity = options.location?.trim() || options.city?.trim() || "";

  if (!searchCity) {
    return [];
  }

  const cacheKey = getLocationCacheKey(options);
  if (cacheKey) {
    const cached = getCachedNews(cacheKey);
    if (cached) {
      return cached;
    }

    const inflight = inflightNewsRequests.get(cacheKey);
    if (inflight) {
      return inflight;
    }
  }

  const request = Promise.all([
    getOfficialLocalNews(searchCity),
    getTrustedMediaNews(searchCity),
  ])
    .then(([officialArticles, mediaArticles]) => {
      const articles = [...officialArticles, ...mediaArticles]
        .filter((article, index, allArticles) => allArticles.findIndex((item) => getArticleDedupKey(item) === getArticleDedupKey(article)) === index)
        .sort((left, right) => new Date(right.publishedAt).getTime() - new Date(left.publishedAt).getTime())
        .slice(0, MAX_TOTAL_ARTICLES);

      if (cacheKey) {
        setCachedNews(cacheKey, articles);
      }
      return articles;
    })
    .finally(() => {
      if (cacheKey) {
        inflightNewsRequests.delete(cacheKey);
      }
    });

  if (cacheKey) {
    inflightNewsRequests.set(cacheKey, request);
  }

  return request;
}
