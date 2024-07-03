import { act, render } from "@testing-library/react";
import { MockOakConsentClient } from "@oaknational/oak-consent-client";

import CookieConsentProvider from "./CookieConsentProvider";

describe("CookieConsentProvider", () => {
  test("should render its children", () => {
    const { getByTestId } = render(
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
    const { getByText } = render(<CookieConsentProvider client={client} />);

    act(() => {
      getByText("Accept all cookies").click();
    });

    expect(client.logConsents).toHaveBeenCalledWith([
      { consentState: "granted", policyId: "test-policy" },
    ]);
  });
});
