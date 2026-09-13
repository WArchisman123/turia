/**
 * TURIA Central HTTP Client
 * Provides typed get, post, put, patch, del helpers with uniform error handling,
 * JSON serialization, query parameter formatting, and FormData support.
 */

export class ApiError extends Error {
  status: number;
  data: unknown;

  constructor(message: string, status: number, data?: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
  }
}

export interface RequestOptions extends Omit<RequestInit, "body"> {
  params?: Record<string, string | number | boolean | undefined | null>;
}

/**
 * Core request dispatcher
 */
export async function request<T>(
  url: string,
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE",
  body?: unknown,
  options: RequestOptions = {}
): Promise<T> {
  const { params, headers: customHeaders, ...rest } = options;

  let fullUrl = url;
  if (params) {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        searchParams.append(key, String(value));
      }
    });
    const queryString = searchParams.toString();
    if (queryString) {
      fullUrl += (fullUrl.includes("?") ? "&" : "?") + queryString;
    }
  }

  const headers = new Headers(customHeaders);
  const isFormData = typeof FormData !== "undefined" && body instanceof FormData;

  if (!isFormData && !headers.has("Content-Type") && body !== undefined) {
    headers.set("Content-Type", "application/json");
  }

  const response = await fetch(fullUrl, {
    method,
    headers,
    body: isFormData ? (body as FormData) : body !== undefined ? JSON.stringify(body) : undefined,
    ...rest,
  });

  if (!response.ok) {
    let errorMessage = `Request failed with status ${response.status}`;
    let errorData: unknown = null;
    try {
      errorData = await response.json();
      if (typeof errorData === "object" && errorData !== null) {
        if ("error" in errorData && typeof (errorData as { error: unknown }).error === "string") {
          errorMessage = (errorData as { error: string }).error;
        } else if ("message" in errorData && typeof (errorData as { message: unknown }).message === "string") {
          errorMessage = (errorData as { message: string }).message;
        }
      }
    } catch {
      // response body wasn't JSON
    }
    throw new ApiError(errorMessage, response.status, errorData);
  }

  if (response.status === 204) {
    return {} as T;
  }

  return response.json();
}

/**
 * Standard HTTP verb methods
 */
export const get = <T>(url: string, options?: RequestOptions): Promise<T> =>
  request<T>(url, "GET", undefined, options);

export const post = <T>(url: string, data?: unknown, options?: RequestOptions): Promise<T> =>
  request<T>(url, "POST", data, options);

export const put = <T>(url: string, data?: unknown, options?: RequestOptions): Promise<T> =>
  request<T>(url, "PUT", data, options);

export const patch = <T>(url: string, data?: unknown, options?: RequestOptions): Promise<T> =>
  request<T>(url, "PATCH", data, options);

export const del = <T>(url: string, options?: RequestOptions): Promise<T> =>
  request<T>(url, "DELETE", undefined, options);

/**
 * Consolidated API object
 */
export const api = {
  get,
  post,
  put,
  patch,
  delete: del,
};

export default api;

// Re-export all domain modules for single-import convenience:
export * from "./api/leads";
export * from "./api/clients";
export * from "./api/services";
export * from "./api/tasks";
export * from "./api/invoices";
export * from "./api/registry";
export * from "./api/team";
export * from "./api/profile";
export * from "./api/home";
