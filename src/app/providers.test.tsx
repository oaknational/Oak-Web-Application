import type { PropsWithChildren } from "react";

import { POSTHOG_AUTOCAPTURE_URL_ALLOWLIST } from "@/browser-lib/posthog/getPosthogInitConfig";

const init = jest.fn();
const getBrowserConfig = jest.fn((key: string) => {
  switch (key) {
    case "releaseStage":
      return "development";
    case "posthogApiKey":
      return "test-posthog-api-key";
    case "posthogApiHost":
      return "https://eu.i.posthog.com";
    default:
      throw new Error(`Unexpected browser config key: ${key}`);
  }
});

jest.mock("posthog-js", () => ({
  init: (...args: unknown[]) => init(...args),
}));

jest.mock("posthog-js/react", () => ({
  PostHogProvider: ({ children }: PropsWithChildren) => children,
}));

jest.mock("@/browser-lib/getBrowserConfig", () => ({
  __esModule: true,
  default: (...args: [string]) => getBrowserConfig(...args),
}));

describe("src/app/providers", () => {
  beforeEach(() => {
    init.mockClear();
    jest.resetModules();
  });

  test("initialises posthog with consent-safe defaults on app boot", () => {
    jest.isolateModules(() => {
      require("./providers");
    });

    expect(init).toHaveBeenCalledWith(
      "test-posthog-api-key",
      expect.objectContaining({
        api_host: "/ingest",
        ui_host: "https://eu.i.posthog.com",
        cookieless_mode: "on_reject",
        capture_pageview: false,
        disable_session_recording: true,
        autocapture: {
          url_allowlist: POSTHOG_AUTOCAPTURE_URL_ALLOWLIST,
        },
        debug: true,
      }),
    );
  });
});
