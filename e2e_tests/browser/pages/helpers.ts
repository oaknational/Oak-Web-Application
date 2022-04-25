import { BASE_URL } from "../fixtures/flags";

export const getPageUrl = (relativeUrl: string) =>
  new URL(relativeUrl, BASE_URL).href;
