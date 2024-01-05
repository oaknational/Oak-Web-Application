import { renderHook } from "@testing-library/react";

import { ResourceFormProps } from "../downloadAndShare.types";

import { useHubspotSubmit } from "./useHubspotSubmit";

jest.mock("../../../browser-lib/hubspot/forms/hubspotSubmitForm", () => ({
  __esModule: true,
  default: jest.fn(),
}));

jest.mock("../../../hooks/useUtmParams", () => ({
  __esModule: true,
  default: () => ({ utm_source: "les_twitz" }),
}));

const getHubspotUserToken = jest.fn(() => "hubspotutk value");
jest.mock("../../../browser-lib/hubspot/forms/getHubspotUserToken", () => ({
  __esModule: true,
  default: (...args: []) => getHubspotUserToken(...args),
}));

const testPosthogDistinctId = "test-anonymous-id";

jest.mock("../../../context/Analytics/useAnalytics", () => ({
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
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it("should attempt to get the hubspotutk cookie", async () => {
    const { result } = renderHook(() => useHubspotSubmit());
    result.current.onHubspotSubmit(data);

    expect(getHubspotUserToken).toHaveBeenCalled();
  });
});
