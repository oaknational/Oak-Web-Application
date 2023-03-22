import Cookies from "js-cookie";
import { z } from "zod";

/**
 * Gets the legacy `oakData` from Cookies, parses it, and returns the userId;
 * also known has the anonymousId.
 *
 * This is in order to link analytics sessions between old and new apps.
 */
export default function getLegacyAnonymousId(): string | null {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    // first attempt get from cookie
    const oakData = Cookies.get("oakData");
    if (!oakData) {
      return null;
    }

    return z.object({ userId: z.string() }).parse(JSON.parse(oakData)).userId;
  } catch (error) {
    return null;
  }
}
