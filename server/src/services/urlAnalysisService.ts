const FETCH_TIMEOUT_MS = 8000;

export type UrlCheckResult = {
  url: string;
  reachable: boolean;
  finalUrl?: string;
  redirectChain: string[];
  statusCode?: number;
  pageTitle?: string;
  pageTextSnippet?: string;
  suspiciousIndicators: string[];
};

function extractUrls(text: string): string[] {
  const urlRegex = /https?:\/\/[^\s"'<>)]+/gi;
  const matches = text.match(urlRegex) || [];
  // Deduplicate and limit to 3 URLs
  return [...new Set(matches)].slice(0, 3);
}

function extractTitle(html: string): string {
  const match = /<title[^>]*>([^<]{1,200})<\/title>/i.exec(html);
  return match ? match[1].trim() : "";
}

function extractTextSnippet(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 800);
}

function detectSuspiciousIndicators(url: string, finalUrl: string, html: string): string[] {
  const indicators: string[] = [];
  const lowerUrl = url.toLowerCase();
  const lowerFinal = finalUrl.toLowerCase();
  const lowerHtml = html.toLowerCase();

  // URL shorteners
  if (/bit\.ly|tinyurl|t\.co|goo\.gl|ow\.ly|short\.link|rb\.gy|cutt\.ly/.test(lowerUrl)) {
    indicators.push("shortened URL detected");
  }

  // Redirect to different domain
  try {
    const originalDomain = new URL(url).hostname;
    const finalDomain = new URL(finalUrl).hostname;
    if (originalDomain !== finalDomain) {
      indicators.push(`redirects from ${originalDomain} to ${finalDomain}`);
    }
  } catch {
    // ignore parse errors
  }

  // Suspicious TLDs
  if (/\.(xyz|top|click|loan|work|date|faith|review|country|stream|gq|ml|cf|ga|tk)(\/?|$)/.test(lowerFinal)) {
    indicators.push("suspicious top-level domain");
  }

  // IP address URL
  if (/https?:\/\/\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/.test(lowerFinal)) {
    indicators.push("URL uses raw IP address instead of domain");
  }

  // Login/credential page patterns in HTML
  if (/type="password"|input.*password|signin|login form/.test(lowerHtml)) {
    indicators.push("page contains login/credential form");
  }

  // Phishing keywords in page content
  if (/verify your account|confirm your identity|update your payment|suspended|unusual activity/.test(lowerHtml)) {
    indicators.push("phishing language found on page");
  }

  // Brand impersonation
  if (/paypal|amazon|apple|microsoft|google|bank of america|chase|wells fargo|netflix/.test(lowerHtml)) {
    if (!/paypal\.com|amazon\.com|apple\.com|microsoft\.com|google\.com|bankofamerica\.com|chase\.com|wellsfargo\.com|netflix\.com/.test(lowerFinal)) {
      indicators.push("possible brand impersonation detected");
    }
  }

  return indicators;
}

async function checkUrl(url: string): Promise<UrlCheckResult> {
  const redirectChain: string[] = [url];
  const suspiciousIndicators: string[] = [];

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

    const response = await fetch(url, {
      signal: controller.signal,
      redirect: "follow",
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; AIScamDetectionAppBot/1.0)",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      },
    });

    clearTimeout(timeout);

    const finalUrl = response.url || url;
    if (finalUrl !== url) redirectChain.push(finalUrl);

    const contentType = response.headers.get("content-type") || "";
    let pageTitle = "";
    let pageTextSnippet = "";

    if (contentType.includes("text/html")) {
      const html = await response.text();
      pageTitle = extractTitle(html);
      pageTextSnippet = extractTextSnippet(html);
      suspiciousIndicators.push(...detectSuspiciousIndicators(url, finalUrl, html));
    } else {
      suspiciousIndicators.push(...detectSuspiciousIndicators(url, finalUrl, ""));
    }

    return {
      url,
      reachable: true,
      finalUrl,
      redirectChain,
      statusCode: response.status,
      pageTitle,
      pageTextSnippet,
      suspiciousIndicators,
    };
  } catch (err) {
    const isTimeout = err instanceof Error && err.name === "AbortError";
    return {
      url,
      reachable: false,
      finalUrl: url,
      redirectChain,
      statusCode: undefined,
      pageTitle: "",
      pageTextSnippet: isTimeout ? "Request timed out" : "Could not reach URL",
      suspiciousIndicators: isTimeout ? ["URL timed out — may be inactive or blocked"] : ["URL could not be reached"],
    };
  }
}

export async function analyzeUrlsInText(text: string): Promise<{ urls: UrlCheckResult[]; summary: string }> {
  const urls = extractUrls(text);
  if (urls.length === 0) return { urls: [], summary: "" };

  const results = await Promise.all(urls.map(checkUrl));

  const summaryParts: string[] = [];
  for (const result of results) {
    if (result.suspiciousIndicators.length > 0) {
      summaryParts.push(
        `URL ${result.url}: ${result.suspiciousIndicators.join(", ")}.` +
        (result.pageTitle ? ` Page title: "${result.pageTitle}".` : "") +
        (result.pageTextSnippet ? ` Content snippet: ${result.pageTextSnippet.slice(0, 200)}` : ""),
      );
    } else if (result.reachable) {
      summaryParts.push(
        `URL ${result.url}: reachable, no obvious suspicious indicators.` +
        (result.pageTitle ? ` Page title: "${result.pageTitle}".` : ""),
      );
    } else {
      summaryParts.push(`URL ${result.url}: not reachable.`);
    }
  }

  return { urls: results, summary: summaryParts.join("\n") };
}
