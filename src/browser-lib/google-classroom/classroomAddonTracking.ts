const SESSION_KEY = "classroomAddOnOpened";
const NAVIGATION_KEY = "classroomAddOnOpenedNavigation";

const getSessionStorage = () => {
  if (typeof globalThis.window === "undefined") return null;

  try {
    return globalThis.window.sessionStorage;
  } catch {
    return null;
  }
};

const hasSessionFlag = (key: string) => !!getSessionStorage()?.getItem(key);

const setSessionFlag = (key: string) => {
  getSessionStorage()?.setItem(key, "true");
};

const clearSessionFlag = (key: string) => {
  getSessionStorage()?.removeItem(key);
};

/**
 * Uses sessionStorage so the flag survives the full page navigation between
 * the App Router sign-in page and the Pages Router lesson page.
 */
export const classroomAddOnOpenedTracked = () => hasSessionFlag(SESSION_KEY);

export const markClassroomAddOnOpened = () => {
  setSessionFlag(SESSION_KEY);
};

export const trackClassroomAddOnOpenedOnce = (onTrack: () => void) => {
  if (classroomAddOnOpenedTracked()) return false;

  markClassroomAddOnOpened();
  onTrack();
  return true;
};

export const markClassroomAddOnNavigation = () => {
  setSessionFlag(NAVIGATION_KEY);
};

/**
 * Clears the once-per-open flag when the iframe is closed, but preserves it for
 * the one-off sign-in to lesson handoff so we do not double-track on redirect.
 */
export const clearClassroomAddOnOpened = () => {
  if (hasSessionFlag(NAVIGATION_KEY)) {
    clearSessionFlag(NAVIGATION_KEY);
    return;
  }

  clearSessionFlag(SESSION_KEY);
};
