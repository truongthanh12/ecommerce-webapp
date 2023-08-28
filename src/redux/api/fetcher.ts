import axios from "axios";
import queryString from "query-string";

const fetcher = axios.create({
  baseURL: process.env.API_URL,
  headers: {
    "content-type": "application/json",
  },
  paramsSerializer: (params) => queryString.stringify(params),
});

fetcher.interceptors.request.use(async (config) => {
  // Handle token here ...
  return config;
});

fetcher.interceptors.response.use(
  (response: any) => {
    if (response && response.data) {
      return response.data;
    }
    return response;
  },
  (error) => {
    // Handle errors
    throw error;
  }
);
export default fetcher;
