import { renderHook } from "@testing-library/react";

import errorReporter from "../../common-lib/error-reporter";
import { AnalyticsService } from "../../context/Analytics/AnalyticsProvider";
import { ServiceType } from "../cookie-consent/types";

import useAnalyticsService from "./useAnalyticsService";

const service: AnalyticsService<unknown> = {
  name: "test service" as ServiceType,
  init: jest.fn(),
  state: jest.fn(() => "pending"),
  track: jest.fn(),
  page: jest.fn(),
  identify: jest.fn(),
  optOut: jest.fn(),
  optIn: jest.fn(),
  setAnonymousId: jest.fn(),
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
  test("should not call service.init() if consentState:disabled", () => {
    renderHook(() =>
      useAnalyticsService({ service, config: null, consentState: "disabled" })
    );
    expect(service.init).not.toHaveBeenCalled();
  });
  test("should not call service.init() if consentState:pending", () => {
    renderHook(() =>
      useAnalyticsService({ service, config: null, consentState: "pending" })
    );
    expect(service.init).not.toHaveBeenCalled();
  });
  test("should call service.init(config) if consentState:enabled", () => {
    renderHook(() =>
      useAnalyticsService({
        service,
        config: { foo: "bar" },
        consentState: "enabled",
      })
    );
    expect(service.init).toHaveBeenCalledWith({ foo: "bar" });
  });
});
