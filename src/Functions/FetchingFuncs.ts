import axios, {CancelTokenSource} from "axios";

const AWS_PROXY_ENDPOINT='https://g9i9unbrzf.execute-api.eu-north-1.amazonaws.com/default/Robots-Proxy'

export const fetchExamples = async (platform : string) => {
    return [(await axios.get(`/${platform}/good-practice-robots.txt`)).data, (await axios.get(`/${platform}/bad-practice-robots.txt`)).data] as [string, string];
}

/**
 * Fetches the robots.txt content from a specified URL using a server-side proxy
 * with request cancellation support for handling multiple requests.
 *
 * @function
 * @async
 * @param {URL} url - The URL of the website to fetch the robots.txt from.
 * @throws {Error} If there is an error during the request or response handling.
 * @throws {axios.Cancel} If the request is cancelled due to a new request being made.
 * @returns {Promise<string>} A Promise that resolves with the content of the robots.txt file.
 *
 * @example
 * // Fetch robots.txt from "https://example.com"
 * const targetUrl = new URL("https://example.com");
 * try {
 *   const robotsTxtContent = await fetchRobots(targetUrl);
 *   console.log(robotsTxtContent);
 * } catch (error) {
 *   console.error(error.message);
 * }
 */
export const fetchRobots = (() => {
  let currentRequest : CancelTokenSource | null = null; // Stores the current request token in the closure

  return async (url : URL) => {
    if (!(url instanceof URL)) {
      throw new Error('Invalid URL object provided.');
    }

    if (currentRequest) {
      currentRequest.cancel('Request cancelled because a new request was made.');
    }

    const abortController = new AbortController();
    const signal = abortController.signal;
    const source = axios.CancelToken.source();

    const axiosConfig = {
      signal: signal,
      cancelToken: source.token,
      timeout: 5000
    };

    try {
      currentRequest = source; // Store the current request token in the closure
      const requestUrl = new URL(AWS_PROXY_ENDPOINT);
      requestUrl.searchParams.append('url', url.toString());

      const response = await axios.get(requestUrl.toString(), axiosConfig);
      currentRequest = null; // Reset the currentRequest when the request is completed
      return response.data;
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log('Request was cancelled:', error.message);
      } else {
        throw error;
      }
    }
  };
})();

