import { renderHook } from "@testing-library/react-hooks";

import useNewsletterForm from "./useNewsletterForm";

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

describe("useNewsletterForm", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  test("should call analytics.identify() with email", () => {
    const { result } = renderHook(() => useNewsletterForm());
    result.current.onSubmit({ email: "test", name: "", userRole: "" });

    expect(identify).toHaveBeenCalledWith(testAnonymousId, { email: "test" });
  });
  test("should call analytics.identify() with rejected email", () => {
    /**
     * This tests the case when the hubspot form has rejected the email address
     * but we still want to create a contact.
     */
    const { result } = renderHook(() => useNewsletterForm());
    result.current.onSubmit({ emailTextOnly: "test", name: "", userRole: "" });

    expect(identify).toHaveBeenCalledWith(testAnonymousId, { email: "test" });
  });
});
