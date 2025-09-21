const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

interface FetchOptions extends RequestInit {
  requiresAuth?: boolean;
}

export async function fetchApi<T>(
  endpoint: string,
  options: FetchOptions = {},
): Promise<T> {
  const { requiresAuth = true, ...fetchOptions } = options;

  const headers = new Headers(fetchOptions.headers);

  // Add default headers
  if (!headers.has("Content-Type") && !fetchOptions.body) {
    headers.set("Content-Type", "application/json");
  }

  // Add auth token if required
  if (requiresAuth) {
    const token = localStorage.getItem("token");
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    } else {
      throw new Error("Authentication required");
    }
  }

  const response = await fetch(`${apiBaseUrl}${endpoint}`, {
    ...fetchOptions,
    headers,
  });

  // Handle HTTP errors
  if (!response.ok) {
    if (response.status === 401) {
      // Handle unauthorized (potentially expired token)
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/auth/login";
      throw new Error("Session expired. Please login again.");
    }

    const errorText = await response.text();
    throw new Error(errorText || `HTTP error! Status: ${response.status}`);
  }

  // Parse response
  const data = await response.json();
  return data as T;
}
