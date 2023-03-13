import Cookies from "js-cookie";

import cookieOptions from "../cookie-consent/confirmic/cookieOptions";

/**
 * If there is no `oakData` cookie present, set cookie containing userId.
 * This is to keep userId (aka anonymous id) consistent between legacy and beta
 * applications.
 * @todo remove this and unset cookie as part of legacy apps decommission
 */
export default function setLegacyCookieIfNotPresent({
  anonymousId,
}: {
  anonymousId: string;
}) {
  const oakDataCookie = Cookies.get("oakData");
  if (!oakDataCookie) {
    Cookies.set(
      "oakData",
      JSON.stringify({ userId: anonymousId }),
      /**
       * Using assertion as cookieOptions are typed originally as CookieSetOptions
       * from "universal-cookie". These are basically identical, but subtly different.
       * Choosing to assert here rather than elsewhere since this code has an
       * assumed short lifetime.
       */
      cookieOptions as Cookies.CookieAttributes
    );
  }
}
