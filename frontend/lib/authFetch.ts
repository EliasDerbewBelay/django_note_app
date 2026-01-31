export async function authFetch(url: string, options: RequestInit = {}) {
  const accessToken = localStorage.getItem("access_token");

  // attach token
  const headers = {
    ...(options.headers || {}),
    Authorization: "Bearer " + accessToken,
  };

  let response = await fetch(url, {
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

    const refreshResponse = await fetch(
      "http://127.0.0.1:8000/api/token/refresh/",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refresh: refreshToken }),
      },
    );

    if (!refreshResponse.ok) {
      throw new Error("Refresh token invalid");
    }

    const data = await refreshResponse.json();

    // Save new access token
    localStorage.setItem("access_token", data.access);

    // Retry original request with new token
    const retryHeaders = {
      ...(options.headers || {}),
      Authorization: "Bearer " + data.access,
    };

    response = await fetch(url, {
      ...options,
      headers: retryHeaders,
    });
  }

  return response;
}
