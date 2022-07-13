import { WindowOakThemes } from "../../hooks/useOakTheme";
import { WindowOakPosthog } from "../posthog/usePosthog";

type OakGlobals = {
  oakThemes?: WindowOakThemes;
  posthog?: WindowOakPosthog;
};

declare global {
  interface Window {
    __oakGlobals: OakGlobals;
  }
}

if (typeof window !== "undefined") {
  window.__oakGlobals = window.__oakGlobals || {};
}

export const getOakGlobals = () => {
  if (typeof window !== "undefined") {
    return window.__oakGlobals;
  }
  return {};
};
export const setOakGlobals = (value: Partial<OakGlobals>) => {
  if (typeof window !== "undefined") {
    window.__oakGlobals = {
      ...getOakGlobals(),
      ...value,
    };
  }
};
