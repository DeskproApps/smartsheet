import { IDeskproClient, proxyFetch } from "@deskpro/app-sdk";
import getQueryParams from "@/utils/getQueryParams";
import type {  RequestParams } from "@/types/api";


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
      data = {}, 
      method = "GET", 
      queryParams = {}, 
      headers: customHeaders 
    }: RequestParams
  ) : Promise<T> {
    const dpFetch = await proxyFetch(client);
  
    const baseUrl = `https://api.smartsheet.com/2.0${url}`;
    const params = getQueryParams(queryParams);
  
    const requestUrl = `${baseUrl}?${params}`;
    const options: RequestInit = {
      method,
      headers: {
        "Authorization": "Bearer __access_token__",
        ...customHeaders,
      },
    };
  
    if (data instanceof FormData) {
      options.body = data;
    } else if (data && !(typeof data === 'object' && Object.keys(data).length === 0)) {
      options.body = JSON.stringify(data);
      options.headers = {
        "Content-Type": "application/json",
        ...options.headers,
      };
    }
  
    const res = await dpFetch(requestUrl, options);
  
    if (res.status < 200 || res.status > 399) {
      throw new RequestError('Request failed', await res.json());
    }
  
    try {
      return await res.json();
    } catch (e) {
      return {} as T;
    }
  }


export class RequestError<T=unknown> extends Error {
    data: T | null;

    constructor(message: string, data: T | null) {
        super(message);
        this.name = this.constructor.name; 
        this.data = data;
    }
}