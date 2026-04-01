import getBrowserConfig from "../getBrowserConfig";

type GetPosthogInitConfigArgs = {
  apiHost: string;
  uiHost?: string;
  loaded?: () => void;
};

export const POSTHOG_AUTOCAPTURE_URL_ALLOWLIST = [
  "/lesson-planning",
  "/support-your-team",
  "/blog/.*",
  "/webinars/.*",
  "/about-us/.*",
  "/contact-us",
  "/campaigns/.*",
];

export const getPosthogInitConfig = ({
  apiHost,
  uiHost,
  loaded,
}: GetPosthogInitConfigArgs) => ({
  api_host: apiHost,
  ui_host: uiHost,
  cookieless_mode: "on_reject" as const,
  debug: getBrowserConfig("releaseStage") !== "production",
  loaded,
  disable_session_recording: true,
  capture_pageview: false as const,
  autocapture: {
    url_allowlist: POSTHOG_AUTOCAPTURE_URL_ALLOWLIST,
  },
});
