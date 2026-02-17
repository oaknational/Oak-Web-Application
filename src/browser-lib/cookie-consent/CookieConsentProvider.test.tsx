import { act } from "@testing-library/react";
import { MockOakConsentClient } from "@oaknational/oak-consent-client";

import CookieConsentProvider from "./CookieConsentProvider";

import renderWithTheme from "@/__tests__/__helpers__/renderWithTheme";

describe("CookieConsentProvider", () => {
  test("should render its children", () => {
    const { getByTestId } = renderWithTheme(
      <CookieConsentProvider client={new MockOakConsentClient()}>
        <div data-testid="child" />
      </CookieConsentProvider>,
    );

    expect(getByTestId("child")).toBeInTheDocument();
  });

  test("consents are logged on change", () => {
    const client = new MockOakConsentClient({
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

    jest.spyOn(client, "logConsents");
    const { getByText } = renderWithTheme(
      <CookieConsentProvider client={client} />,
    );

    act(() => {
      getByText("Accept all cookies").click();
    });

    expect(client.logConsents).toHaveBeenCalledWith([
      { consentState: "granted", policyId: "test-policy" },
    ]);
  });
});
