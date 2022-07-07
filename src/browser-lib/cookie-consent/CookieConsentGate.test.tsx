import "../../__tests__/__helpers__/LocalStorageMock";
import renderWithProviders from "../../__tests__/__helpers__/renderWithProviders";

import CookieConsentGate from "./CookieConsentGate";

describe("CookieConsentGate", () => {
  test("should not render its children if policy not consented to", () => {
    const { queryByText } = renderWithProviders(
      <CookieConsentGate policyName="statistics">
        <div>child</div>
      </CookieConsentGate>
    );

    expect(queryByText("child")).not.toBeInTheDocument();
  });
  test("should render its children if policy is consented to", () => {
    window.localStorage.setItem(
      "metomic-consented-pol:b109d120-ec88-4dd7-9f6e-fc67ab6f0ffb",
      JSON.stringify({ enabled: true })
    );
    const { queryByText } = renderWithProviders(
      <CookieConsentGate policyName="statistics">
        <div>child</div>
      </CookieConsentGate>
    );

    expect(queryByText("child")).toBeInTheDocument();
  });
});
