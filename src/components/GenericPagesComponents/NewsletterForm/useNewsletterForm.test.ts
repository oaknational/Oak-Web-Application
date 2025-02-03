import { renderHook } from "@testing-library/react";

import useNewsletterForm from "./useNewsletterForm";

import {
  getHubspotNewsletterPayload,
  NewsletterHubspotFormData,
} from "@/browser-lib/hubspot/forms/getHubspotFormPayloads";

const identify = vi.fn();

const testPosthogDistinctId = "test-anonymous-id";

vi.mock("@/context/Analytics/useAnalytics", () => ({
  __esModule: true,
  default: () => ({
    identify: (...args: []) => identify(...args),
    posthogDistinctId: testPosthogDistinctId,
  }),
}));
const hubspotSubmitForm = vi.fn();
vi.mock("@/browser-lib/hubspot/forms/hubspotSubmitForm", () => ({
  __esModule: true,
  default: (...args: []) => hubspotSubmitForm(...args),
}));
vi.mock("@/hooks/useUtmParams", () => ({
  __esModule: true,
  default: () => ({ utm_source: "les_twitz" }),
}));

describe("useNewsletterForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
  test("should call hubspotSubmitForm() and include utm params", () => {
    const { result } = renderHook(() => useNewsletterForm());
    const data: NewsletterHubspotFormData = {
      email: "test",
      name: "sdfo9dfj",
      userRole: "Teacher",
    };
    result.current.onSubmit(data);
    const newsletterPayload = getHubspotNewsletterPayload({
      hutk: undefined,
      data: { ...data, utm_source: "les_twitz" },
    });
    expect(hubspotSubmitForm).toHaveBeenCalledWith({
      payload: newsletterPayload,
      hubspotFormId: "NEXT_PUBLIC_HUBSPOT_NEWSLETTER_FORM_ID",
    });
  });
  test("should call analytics.identify() with email", () => {
    const { result } = renderHook(() => useNewsletterForm());
    result.current.onSubmit({ email: "test", name: "", userRole: "" });

    expect(identify).toHaveBeenCalledWith(
      testPosthogDistinctId,
      {
        email: "test",
      },
      ["hubspot"],
    );
  });
  test("should call analytics.identify() with rejected email", () => {
    /**
     * This tests the case when the hubspot form has rejected the email address
     * but we still want to create a contact.
     */
    const { result } = renderHook(() => useNewsletterForm());
    result.current.onSubmit({ emailTextOnly: "test", name: "", userRole: "" });

    expect(identify).toHaveBeenCalledWith(
      testPosthogDistinctId,
      {
        email: "test",
      },
      ["hubspot"],
    );
  });
});
