"use server";

import { cookies } from "next/headers";

interface ApiOptions {
  endpoint: string;
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  data?: unknown;
  requireAuth?: boolean;
}

export interface ApiResult<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  unauthorized?: boolean;
  retryAfter?: number;
}

export async function universalApi<T = unknown>({
  endpoint,
  method = "GET",
  data,
  requireAuth = true,
}: ApiOptions): Promise<ApiResult<T>> {
  const apiUrl = process.env.BASE_URL || process.env.NEXT_PUBLIC_BASE_URL;
  if (!apiUrl) throw new Error("BASE_URL is not set in environment variables");

  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;

    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };

    if (requireAuth && accessToken) {
      headers["Authorization"] = `Bearer ${accessToken}`;
    }

    const options: RequestInit = {
      method,
      headers,
      cache: "no-store",
    };

    if (data && ["POST", "PUT", "PATCH", "DELETE"].includes(method)) {
      options.body = JSON.stringify(data);
    }

    const response = await fetch(`${apiUrl}${endpoint}`, options);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));

      if (response.status === 401) {
        return {
          success: false,
          unauthorized: true,
          message: errorData.message || "Unauthorized. Please login again.",
        };
      }

      if (response.status === 429) {
        const retryAfter = response.headers.get("Retry-After");
        return {
          success: false,
          message: errorData.message || "Too Many Requests",
          retryAfter: retryAfter ? parseInt(retryAfter, 10) : undefined,
        };
      }

      return {
        success: false,
        message: errorData.message || `Error: ${response.statusText}`,
      };
    }

    const responseData = await response.json();
    return { success: true, data: responseData };
  } catch (error) {
    console.error("API Error:", error);
    return { success: false, message: "Network error. Please try again." };
  }
}
