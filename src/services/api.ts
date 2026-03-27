const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

type ApiRequestOptions = RequestInit & {
  authToken?: string | null;
};

export async function apiRequest<T>(path: string, options?: ApiRequestOptions): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options?.authToken ? { Authorization: `Bearer ${options.authToken}` } : {}),
      ...(options?.headers || {}),
    },
  });

  if (!response.ok) {
    const contentType = response.headers.get("content-type") || "";
    if (contentType.includes("application/json")) {
      const payload = (await response.json()) as { message?: string };
      throw new Error(payload.message || `Request failed: ${response.status}`);
    }
    throw new Error(`Request failed: ${response.status}`);
  }

  return response.json() as Promise<T>;
}

export function getApiBase() {
  return API_BASE;
}
