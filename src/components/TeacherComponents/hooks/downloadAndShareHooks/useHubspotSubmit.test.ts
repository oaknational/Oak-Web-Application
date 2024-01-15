import { renderHook } from "@testing-library/react";

import { useHubspotSubmit } from "./useHubspotSubmit";

import { ResourceFormProps } from "@/components/TeacherComponents/types/downloadAndShare.types";
import OakError from "@/errors/OakError";

const hubspotSubmitMock = jest.fn();
jest.mock("@/browser-lib/hubspot/forms/hubspotSubmitForm", () => ({
  __esModule: true,
  default: () => hubspotSubmitMock(),
}));

jest.mock("@/hooks/useUtmParams", () => ({
  __esModule: true,
  default: () => ({ utm_source: "les_twitz" }),
}));

const getHubspotUserToken = jest.fn(() => "hubspotutk value");
jest.mock("@/browser-lib/hubspot/forms/getHubspotUserToken", () => ({
  __esModule: true,
  default: (...args: []) => getHubspotUserToken(...args),
}));

const reportError = jest.fn();
jest.mock("@/common-lib/error-reporter/", () => ({
  __esModule: true,
  default:
    () =>
    (...args: []) =>
      reportError(...args),
}));

const testPosthogDistinctId = "test-anonymous-id";

jest.mock("@/context/Analytics/useAnalytics", () => ({
  __esModule: true,
  default: () => ({
    posthogDistinctId: testPosthogDistinctId,
  }),
}));

const data: ResourceFormProps = {
  onSubmit: jest.fn(),
  email: "test@test.com",
  school: "222-Sample school",
  schoolName: "Sample school",
  terms: true,
  resources: ["intro-quiz-questions"],
};

describe("useHubspotSumit", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  it("should attempt to get the hubspotutk cookie", async () => {
    const { result } = renderHook(() => useHubspotSubmit());
    result.current.onHubspotSubmit(data);

    expect(getHubspotUserToken).toHaveBeenCalled();
  });
  it("should report an Oak Error when the source is generic", async () => {
    hubspotSubmitMock.mockRejectedValueOnce(new Error("test error"));
    const { result } = renderHook(() => useHubspotSubmit());
    await result.current.onHubspotSubmit(data);

    expect(reportError).toHaveBeenCalledWith(
      new OakError({
        code: "hubspot/unknown",
        originalError: "test error",
      }),
    );
  });
  it("should report an Oak Error as it occurs", async () => {
    hubspotSubmitMock.mockRejectedValueOnce(
      new OakError({
        code: "hubspot/invalid-email",
      }),
    );
    const { result } = renderHook(() => useHubspotSubmit());
    await result.current.onHubspotSubmit(data);

    expect(reportError).toHaveBeenCalledWith(
      new OakError({
        code: "hubspot/invalid-email",
      }),
    );
  });
});
