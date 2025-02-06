import { IDeskproClient, proxyFetch } from "@deskpro/app-sdk";
import getQueryParams from "@/utils/getQueryParams";
import type { RequestParams } from "@/types/api";


/**
 * Makes a request to the Smartsheet API and returns the response.
 *
 * @template T - The type of the response data.
 * 
 * @returns {Promise<T>} A promise that resolves to the parsed JSON response, or an empty object if parsing fails.
 * @throws {RequestError} If the HTTP status code indicates a failed request (not 2xx or 3xx).
 */
export async function baseRequest<T>(
  client: IDeskproClient,
  {
    url,
    data,
    method = "GET",
    queryParams = {},
    headers: customHeaders
  }: RequestParams
): Promise<T> {
  const dpFetch = await proxyFetch(client);

  const baseUrl = `https://api.smartsheet.com/2.0${url}`;
  const params = getQueryParams(queryParams);

  const requestUrl = `${baseUrl}?${params}`;
  const options: RequestInit = {
    method,
    body: data,
    headers: {
      "Authorization": "Bearer __access_token__",
      ...customHeaders,
      ...(data ? { "Content-Type": "application/json" } : {}),
    },
  }

  const res = await dpFetch(requestUrl, options);

  if (res.status < 200 || res.status > 399) {
    let errorData: unknown;
    const rawText = await res.text() 

    try {
      errorData = JSON.parse(rawText) 
    } catch {
      errorData = { message: "Non-JSON error response received", raw: rawText }
    }

    throw new RequestError("Request failed", errorData);
  }

  try {
    return await res.json() as T;
  } catch (e) {
    throw new RequestError("Failed to parse JSON response", null)
  }
}

export class RequestError<T = unknown> extends Error {
  data: T | null;

  constructor(message: string, data: T | null) {
    super(message);
    this.name = this.constructor.name;
    this.data = data;
  }
}