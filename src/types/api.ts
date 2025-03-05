import { Dict } from "./general";
import { ParamKeyValuePair } from "react-router-dom";

export type ApiRequestMethod = "GET" | "POST" | "PUT" | "DELETE";

export type RequestParams = {
  url: string,
  method?: ApiRequestMethod,
  data?: string, // The stringified data object (JSON)
  headers?: Dict<string>,
  queryParams?: string | Dict<string> | ParamKeyValuePair[],
};