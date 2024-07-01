import { act, render } from "@testing-library/react";

import CookieConsentProvider, {
  useCookieConsent,
} from "./CookieConsentProvider";
import { consentClient } from "./consentClient";

describe("CookieConsentProvider", () => {
  test("should render its children", () => {
    const { getByTestId } = render(
      <CookieConsentProvider>
        <div data-testid="child" />
      </CookieConsentProvider>,
    );

    expect(getByTestId("child")).toBeInTheDocument();
  });

  test("consents are logged on change", async () => {
    const getStateSpy = jest.spyOn(consentClient, "getState").mockReturnValue({
      policyConsents: [
        {
          policyId: "test-policy",
          policySlug: "test-policy-slug",
          consentState: "pending",
          isStrictlyNecessary: false,
          policyLabel: "Test Policy",
          policyDescription: "Test Policy Description",
          consentedToPreviousVersion: false,
          policyParties: [],
        },
      ],
      requiresInteraction: true,
    });
    const logConsentsSpy = jest.spyOn(consentClient, "logConsents");
    const { getByText } = render(<CookieConsentProvider />);

    await act(() => {
      getByText("Accept all cookies").click();
    });

    expect(consentClient.logConsents).toHaveBeenCalledWith([
      { consentState: "granted", policyId: "test-policy" },
    ]);

    getStateSpy.mockRestore();
    logConsentsSpy.mockRestore();
  });
});

describe("useCookieConsent", () => {
  test("should throw an error when used outside of CookieConsentProvider", () => {
    expect(() => useCookieConsent()).toThrow();
  });
});
