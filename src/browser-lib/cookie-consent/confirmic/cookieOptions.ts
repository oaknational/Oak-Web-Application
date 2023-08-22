/**
 * Copied from Acorn codebase. Review during development of new cookie manager
 */
import { CookieSetOptions } from "universal-cookie";

import getBrowserConfig from "../../getBrowserConfig";

const releaseStage = getBrowserConfig("releaseStage");

const getDomain = (_releaseStage: string) => {
  switch (_releaseStage) {
    case "production":
    case "preview":
    case "preview-netlify":
      return ".thenational.academy";

    default:
      return;
  }
};
const getSecure = (_releaseStage: string) => {
  switch (_releaseStage) {
    case "production":
    case "preview":
    case "preview-netlify":
      return true;

    default:
      return false;
  }
};

const nextYear = new Date();
nextYear.setFullYear(nextYear.getFullYear() + 1);

const cookieOptions: CookieSetOptions = {
  path: "/",
  expires: nextYear,
  domain: getDomain(releaseStage),
  secure: getSecure(releaseStage),
  sameSite: "lax",
};

export default cookieOptions;
