import { ONTARIO_CITY_ALIASES, ONTARIO_OFFICIAL_SOURCE_CONFIGS, type OfficialSourceConfig } from "../data/ontarioOfficialNewsSources";

export type NewsArticle = {
  title: string;
  description: string | null;
  url: string;
  source: string;
  publishedAt: string;
  urlToImage: string | null;
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

function matchesLocation(text: string, city: string, config: OfficialSourceConfig): boolean {
  const normalizedText = normalizeText(text);
  const normalizedCity = normalizeText(city);
  const aliases = ONTARIO_CITY_ALIASES[normalizedCity] ?? [normalizedCity, ...(config.regionalAliases ?? [])];
  return aliases.some((alias) => normalizedText.includes(normalizeText(alias)));
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
  const response = await fetch(url, {
    headers: {
      "user-agent": "Mozilla/5.0 AIScamDetectionApp News Fetcher",
      accept: "text/html,application/xhtml+xml",
    },
  });

  if (!response.ok) {
    throw new Error(`Unable to fetch ${url}: ${response.status}`);
  }

  return response.text();
}

async function fetchXml(url: string): Promise<string> {
  const response = await fetch(url, {
    headers: {
      "user-agent": "Mozilla/5.0 AIScamDetectionApp News Fetcher",
      accept: "application/xml,text/xml,text/plain,*/*",
    },
  });

  if (!response.ok) {
    throw new Error(`Unable to fetch ${url}: ${response.status}`);
  }

  return response.text();
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
  const sitemapCandidates = await Promise.all(
    (config.sitemapUrls ?? []).map(async (sitemapUrl) => {
      try {
        const xml = await fetchXml(sitemapUrl);
        return extractSitemapCandidates(xml, config);
      } catch {
        return [];
      }
    }),
  );

  const listingCandidates = await Promise.all(
    config.listingUrls.map(async (listingUrl) => {
      try {
        const html = await fetchHtml(listingUrl);
        return extractCandidateLinks(html, config, listingUrl);
      } catch {
        return [];
      }
    }),
  );

  return [...sitemapCandidates.flat(), ...listingCandidates.flat()]
    .filter((candidate, index, allCandidates) => allCandidates.findIndex((item) => item.url === candidate.url) === index)
    .sort((left, right) => {
      const rightTime = right.lastmod ? new Date(right.lastmod).getTime() : 0;
      const leftTime = left.lastmod ? new Date(left.lastmod).getTime() : 0;
      const fraudPriority = Number(looksLikeFraudNews(right.titleHint)) - Number(looksLikeFraudNews(left.titleHint));
      return fraudPriority || rightTime - leftTime;
    })
    .slice(0, 250);
}

async function parseOfficialArticle(candidate: ArticleCandidate, config: OfficialSourceConfig, city: string): Promise<NewsArticle | null> {
  try {
    const html = await fetchHtml(candidate.url);
    const title = extractMetaContent(html, "og:title") || extractFirstMatch(html, /<title>([\s\S]*?)<\/title>/i) || candidate.titleHint;
    const description =
      extractMetaContent(html, "description") ||
      extractMetaContent(html, "og:description") ||
      extractParagraphs(html)[0] ||
      null;
    const publishedAt = extractDateValue(html) || candidate.lastmod || new Date().toISOString();
    const urlToImage = extractMetaContent(html, "og:image");
    const relevanceText = `${title} ${description ?? ""} ${extractParagraphs(html).slice(0, 3).join(" ")}`;

    if (!looksLikeFraudNews(relevanceText)) {
      return null;
    }

    if (!matchesLocation(relevanceText, city, config)) {
      return null;
    }

    return {
      title,
      description,
      url: candidate.url,
      source: config.sourceName,
      publishedAt,
      urlToImage,
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

      for (const candidate of candidates) {
        const article = await parseOfficialArticle(candidate, config, city);
        if (article) {
          articles.push(article);
        }

        if (articles.length >= 10) {
          break;
        }
      }

      return articles;
    }),
  );

  return results
    .flat()
    .filter((article, index, allArticles) => allArticles.findIndex((item) => item.url === article.url) === index)
    .sort((left, right) => new Date(right.publishedAt).getTime() - new Date(left.publishedAt).getTime())
    .slice(0, 10);
}

export async function getCyberFraudNews(options: NewsSearchOptions = {}): Promise<NewsArticle[]> {
  const searchCity = options.location?.trim() || options.city?.trim() || "";

  if (!searchCity) {
    return [];
  }

  return getOfficialLocalNews(searchCity);
}
