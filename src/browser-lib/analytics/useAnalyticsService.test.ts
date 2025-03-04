import { renderHook, waitFor } from "@testing-library/react";

import errorReporter from "../../common-lib/error-reporter";
import { AnalyticsService } from "../../context/Analytics/AnalyticsProvider";

import useAnalyticsService from "./useAnalyticsService";

const service: AnalyticsService<unknown> = {
  name: "posthog",
  init: jest.fn(() => Promise.resolve("test-posthog-distinct-id")),
  state: jest.fn(() => "pending"),
  track: jest.fn(),
  page: jest.fn(),
  identify: jest.fn(),
  alias: jest.fn(),
  optOut: jest.fn(),
  optIn: jest.fn(),
};

describe("useAnalyticsService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetModules();
    jest.mock("../../common-lib/error-reporter", () => ({
      __esModule: true,
      default: jest.fn(errorReporter),
    }));
  });
  test("should not call service.init() if consentState:denied", () => {
    renderHook(() =>
      useAnalyticsService({ service, config: null, consentState: "denied" }),
    );
    expect(service.init).not.toHaveBeenCalled();
  });
  test("should not call service.init() if consentState:pending", () => {
    renderHook(() =>
      useAnalyticsService({ service, config: null, consentState: "pending" }),
    );
    expect(service.init).not.toHaveBeenCalled();
  });
  test("should call service.init(config) if consentState:granted", () => {
    renderHook(() =>
      useAnalyticsService({
        service,
        config: { foo: "bar" },
        consentState: "granted",
      }),
    );
    expect(service.init).toHaveBeenCalledWith({ foo: "bar" });
  });
  test("should set posthog distinct if callback passed", async () => {
    const setPosthogDistinctId = jest.fn();

    renderHook(() =>
      useAnalyticsService({
        service,
        config: { foo: "bar" },
        consentState: "granted",
        setPosthogDistinctId,
      }),
    );
    await waitFor(() => {
      expect(setPosthogDistinctId).toHaveBeenCalledWith(
        "test-posthog-distinct-id",
      );
    });
  });

  test("should clear posthog distinct id when loaded and consentState:denied", async () => {
    const setPosthogDistinctId = jest.fn();

    const result = renderHook(
      (...args: Parameters<typeof useAnalyticsService>) =>
        useAnalyticsService(...args),
      {
        initialProps: {
          service,
          config: { foo: "bar" },
          consentState: "granted",
          setPosthogDistinctId,
        },
      },
    );

    result.rerender({
      service,
      config: { foo: "bar" },
      consentState: "denied",
      setPosthogDistinctId,
    });

    await waitFor(() => {
      expect(setPosthogDistinctId).toHaveBeenLastCalledWith(null);
    });
  });
});
