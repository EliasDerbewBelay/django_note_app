import { API_BASE } from "@/lib/api";

export async function authFetch(url: string, options: RequestInit = {}) {
  const accessToken = localStorage.getItem("access_token");

  // Prepend API_BASE if URL is relative
  const fullUrl = url.startsWith("http") ? url : `${API_BASE}${url}`;

  // attach token
  const headers = {
    ...(options.headers || {}),
    Authorization: "Bearer " + accessToken,
  };

  let response = await fetch(fullUrl, {
    ...options,
    headers,
  });

  // If token expired → try refresh
  if (response.status === 401) {
    const refreshToken = localStorage.getItem("refresh_token");

    if (!refreshToken) {
      window.location.href = "/auth/login";
      return response;
    }

    // Use API_BASE for refresh endpoint
    const refreshResponse = await fetch(`${API_BASE}/api/token/refresh/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh: refreshToken }),
    });

    if (!refreshResponse.ok) {
      // Clear tokens and redirect to login
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      window.location.href = "/auth/login";
      return response;
    }

    const data = await refreshResponse.json();

    // Save new access token
    localStorage.setItem("access_token", data.access);

    // Retry original request with new token
    const retryHeaders = {
      ...(options.headers || {}),
      Authorization: "Bearer " + data.access,
    };

    response = await fetch(fullUrl, {
      ...options,
      headers: retryHeaders,
    });
  }

  return response;
}
