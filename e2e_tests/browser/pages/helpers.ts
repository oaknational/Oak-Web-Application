import { BASE_URL } from "../fixtures/flags";

/**
 * Given a base URL and a relative URL, construct an absolute URL.
 *
 * @param relativeUrl The relative URL of the target page, no leading slash, e.g. "search".
 * @returns The constructed absolute URL.
 *
 * @throws Throws if the URL arguments are invalid.
 */
export const getPageUrl = (relativeUrl: string) =>
  new URL(relativeUrl, BASE_URL).href;
