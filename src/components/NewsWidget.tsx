import { useEffect, useState } from "react";
import { useGeolocation } from "../hooks/useGeolocation";
import { apiRequest } from "../services/api";

type NewsArticle = {
  title: string;
  description: string | null;
  url: string;
  source: string;
  publishedAt: string;
  urlToImage: string | null;
};

type ResolvedLocation = {
  city: string;
  state: string;
  country: string;
  label: string;
};

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export default function NewsWidget() {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [manualLocation, setManualLocation] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [detectedLocation, setDetectedLocation] = useState<ResolvedLocation | null>(null);
  const { location: browserLocation, isLoading: isDetectingLocation } = useGeolocation();

  useEffect(() => {
    if (!browserLocation) {
      return;
    }

    let cancelled = false;

    const resolveDetectedLocation = async () => {
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/reverse?lat=${browserLocation.latitude}&lon=${browserLocation.longitude}&format=json&addressdetails=1`,
        );

        if (!res.ok) {
          throw new Error(`Reverse geocoding failed: ${res.status}`);
        }

        const data = (await res.json()) as {
          address?: {
            city?: string;
            town?: string;
            village?: string;
            municipality?: string;
            county?: string;
            state?: string;
            country?: string;
          };
        };

        const city =
          data.address?.city ||
          data.address?.town ||
          data.address?.village ||
          data.address?.municipality ||
          data.address?.county ||
          "";
        const state = data.address?.state || "";
        const country = data.address?.country || "";

        if (!city && !state && !country) {
          return;
        }

        const label = [city, state].filter(Boolean).join(", ") || country;

        if (!cancelled) {
          setDetectedLocation({ city, state, country, label });
        }
      } catch {
        // Location detection failed silently
      }
    };

    void resolveDetectedLocation();

    return () => {
      cancelled = true;
    };
  }, [browserLocation]);

  useEffect(() => {
    if (!manualLocation && detectedLocation?.city) {
      setInputValue(detectedLocation.city);
    }
  }, [detectedLocation, manualLocation]);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    const params = new URLSearchParams();

    if (manualLocation?.trim()) {
      params.set("location", manualLocation.trim());
    } else if (detectedLocation) {
      if (detectedLocation.city) params.set("city", detectedLocation.city);
      if (detectedLocation.state) params.set("state", detectedLocation.state);
      if (detectedLocation.country) params.set("country", detectedLocation.country);
    }

    const queryString = params.toString();
    const requestPath = queryString ? `/news?${queryString}` : "/news";

    apiRequest<{ articles: NewsArticle[] }>(requestPath)
      .then(({ articles: data }) => {
        if (!cancelled) setArticles(data);
      })
      .catch(() => {
        if (!cancelled) setError("Unable to load news. Please try again.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [manualLocation, detectedLocation]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setManualLocation(inputValue.trim() || null);
  };

  const activeLocationLabel = manualLocation?.trim() || detectedLocation?.label || "";

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.14em] text-gray-500">Live Intelligence</p>
          <h2 className="mt-1 text-xl font-semibold text-gray-900">Cyber Fraud News</h2>
          {!activeLocationLabel && isDetectingLocation && (
            <p className="mt-1 text-sm text-gray-500">Detecting your city...</p>
          )}
          {activeLocationLabel && (
            <p className="mt-1 text-sm text-gray-500">
              Showing results for <span className="font-medium text-blue-600">{activeLocationLabel}</span>
            </p>
          )}
        </div>

        <form onSubmit={handleSearch} className="flex gap-2">
          <input
            className="w-44 rounded-xl border border-gray-300 px-3 py-2 text-sm focus:border-blue-400 focus:outline-none"
            placeholder="Search by city..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
          <button
            type="submit"
            className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
          >
            Search
          </button>
        </form>
      </div>

      <div className="mt-5">
        {loading && (
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-24 animate-pulse rounded-xl bg-gray-100" />
            ))}
          </div>
        )}

        {!loading && error && <p className="text-sm text-red-500">{error}</p>}

        {!loading && !error && articles.length === 0 && (
          <p className="text-sm text-gray-500">
            No official local fraud news found for this city right now. Try another nearby city or police region.
          </p>
        )}

        {!loading && !error && (
          <div className="space-y-3">
            {articles.map((article, i) => (
              <a
                key={i}
                href={article.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex gap-3 rounded-xl border border-gray-100 p-3 transition-colors hover:border-blue-200 hover:bg-blue-50"
              >
                {article.urlToImage && (
                  <img
                    src={article.urlToImage}
                    alt=""
                    className="h-14 w-20 flex-shrink-0 rounded-lg object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = "none";
                    }}
                  />
                )}
                <div className="min-w-0 flex-1">
                  <p className="line-clamp-2 text-sm font-medium text-gray-900 group-hover:text-blue-700">
                    {article.title}
                  </p>
                  {article.description && (
                    <p className="mt-1 line-clamp-2 text-sm text-gray-600">
                      {article.description}
                    </p>
                  )}
                  <div className="mt-1 flex items-center gap-2 text-xs text-gray-500">
                    <span className="font-medium">{article.source}</span>
                    <span className="rounded-full bg-blue-50 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-[0.08em] text-blue-700">
                      Official
                    </span>
                    <span>&middot;</span>
                    <span>{timeAgo(article.publishedAt)}</span>
                  </div>
                </div>
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
