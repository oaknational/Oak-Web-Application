import { describe, expect, it } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";

import errorReporter from "../../common-lib/error-reporter";
import { AnalyticsService } from "../../context/Analytics/AnalyticsProvider";
import { ServiceType } from "../cookie-consent/types";

import useAnalyticsService from "./useAnalyticsService";

const service: AnalyticsService<unknown> = {
  name: "test service" as ServiceType,
  init: vi.fn(() => Promise.resolve("test-posthog-distinct-id")),
  state: vi.fn(() => "pending"),
  track: vi.fn(),
  page: vi.fn(),
  identify: vi.fn(),
  optOut: vi.fn(),
  optIn: vi.fn(),
};

const setPosthogDistinctId = vi.fn();
vi.mock("../../common-lib/error-reporter", () => ({
  __esModule: true,
  default: (ctx: string) => errorReporter(ctx),
}));

describe("useAnalyticsService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.resetModules();
  });
  it("should not call service.init() if consentState:disabled", () => {
    renderHook(() =>
      useAnalyticsService({ service, config: null, consentState: "disabled" }),
    );
    expect(service.init).not.toHaveBeenCalled();
  });
  it("should not call service.init() if consentState:pending", () => {
    renderHook(() =>
      useAnalyticsService({ service, config: null, consentState: "pending" }),
    );
    expect(service.init).not.toHaveBeenCalled();
  });
  it("should call service.init(config) if consentState:enabled", () => {
    renderHook(() =>
      useAnalyticsService({
        service,
        config: { foo: "bar" },
        consentState: "enabled",
      }),
    );
    expect(service.init).toHaveBeenCalledWith({ foo: "bar" });
  });
  it("should set posthog distinct if callback passed", async () => {
    renderHook(() =>
      useAnalyticsService({
        service,
        config: { foo: "bar" },
        consentState: "enabled",
        setPosthogDistinctId,
      }),
    );
    await waitFor(() => {
      expect(setPosthogDistinctId).toHaveBeenCalledWith(
        "test-posthog-distinct-id",
      );
    });
  });
});
