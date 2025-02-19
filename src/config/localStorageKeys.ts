/**
 * All local storage keys we use should be exported from here.
 * If a piece of local storage state is no longer used (or its name changed),
 * please ensure to remove it from local storage in a once-only hook.
 */
export const LS_KEY_THEME = "oak-theme";
export const LS_KEY_UTM_PARAMS = "oak-utm-params";
export const LS_KEY_PAST_WEBINARS_UNLOCKED = "oak-past-webinars-unlocked";
export const LS_KEY_EMAIL = "oak-downloads-email";
export const LS_KEY_SCHOOL = "oak-downloads-school";
export const LS_KEY_TERMS = "oak-downloads-terms";
export const LS_KEY_RISK_ASSESSMENT = "oak-downloads-risk-assessment";

/**
 * Decommissioned keys
 */
const DECOMMISSIONED_LS_KEY_EMAIL_FOR_SIGN_IN = "oak-email-for-sign-in";
const DECOMMISSIONED_LS_KEY_USER = "oak-user";
const DECOMMISSIONED_LS_KEY_ACCESS_TOKEN = "oak-access-token";
const DECOMMISSIONED_LS_KEY_BOOKMARKS = "oak-bookmarks";
const DECOMMISSIONED_LS_KEY_ANONYMOUS_ID = "oak-anonymous-id";
/**
 * When decommissioning keys, check the dates on other keys, if it's been more
 * than a couple of months, it's safe to remove them from the codebase.
 */
export const decommissionedKeys = [
  {
    key: DECOMMISSIONED_LS_KEY_EMAIL_FOR_SIGN_IN,
    decommissionedAt: "2023-03-15",
  },
  { key: DECOMMISSIONED_LS_KEY_USER, decommissionedAt: "2023-03-15" },
  { key: DECOMMISSIONED_LS_KEY_ACCESS_TOKEN, decommissionedAt: "2023-03-15" },
  { key: DECOMMISSIONED_LS_KEY_BOOKMARKS, decommissionedAt: "2023-03-15" },
  { key: DECOMMISSIONED_LS_KEY_ANONYMOUS_ID, decommissionedAt: "2023-03-15" },
];
