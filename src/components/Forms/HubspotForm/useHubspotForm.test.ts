import { renderHook } from "@testing-library/react";

import { HubspotFormData } from "../../../browser-lib/hubspot/forms/hubspotSubmitForm";

import useHubspotForm from "./useHubspotForm";

const identify = jest.fn();

const testAnonymousId = "test-anonymous-id";

jest.mock("../../../context/Analytics/useAnalytics", () => ({
  __esModule: true,
  default: () => ({
    identify: (...args: []) => identify(...args),
  }),
}));
jest.mock("../../../browser-lib/analytics/useAnonymousId", () => ({
  __esModule: true,
  default: () => testAnonymousId,
}));
const hubspotSubmitForm = jest.fn();
jest.mock("../../../browser-lib/hubspot/forms/hubspotSubmitForm", () => ({
  __esModule: true,
  default: (...args: []) => hubspotSubmitForm(...args),
}));
jest.mock("../../../hooks/useUtmParams", () => ({
  __esModule: true,
  default: () => ({ utm_source: "les_twitz" }),
}));

describe("useNewsletterForm", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  test("should call hubspotSubmitForm() and include utm params", () => {
    const { result } = renderHook(() => useHubspotForm());
    const data: HubspotFormData = {
      email: "test",
      name: "sdfo9dfj",
      userRole: "Teacher",
    };
    result.current.onSubmit(data);

    expect(hubspotSubmitForm).toHaveBeenCalledWith({
      data: {
        ...data,
        utm_source: "les_twitz",
      },
      hubspotFormId: "NEXT_PUBLIC_HUBSPOT_NEWSLETTER_FORM_ID",
    });
  });
  test("should call analytics.identify() with email", () => {
    const { result } = renderHook(() => useHubspotForm());
    result.current.onSubmit({ email: "test", name: "", userRole: "" });

    expect(identify).toHaveBeenCalledWith(testAnonymousId, { email: "test" });
  });
  test("should call analytics.identify() with rejected email", () => {
    /**
     * This tests the case when the hubspot form has rejected the email address
     * but we still want to create a contact.
     */
    const { result } = renderHook(() => useHubspotForm());
    result.current.onSubmit({ emailTextOnly: "test", name: "", userRole: "" });

    expect(identify).toHaveBeenCalledWith(testAnonymousId, { email: "test" });
  });
});
