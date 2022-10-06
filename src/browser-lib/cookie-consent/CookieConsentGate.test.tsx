import { render } from "@testing-library/react";

import "../../__tests__/__helpers__/LocalStorageMock";

import CookieConsentGate from "./CookieConsentGate";
import CookieConsentProvider from "./CookieConsentProvider";

const useCookies = jest.fn(() => [[], jest.fn()]);
jest.mock("react-cookie", () => ({
  __esModule: true,
  useCookies: () => useCookies(),
}));

describe("CookieConsentGate", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });
  test("should not render its children if policy not consented to", () => {
    const { queryByText } = render(
      <CookieConsentGate serviceType="bugsnag">
        <div>child</div>
      </CookieConsentGate>,
      { wrapper: CookieConsentProvider }
    );

    expect(queryByText("child")).not.toBeInTheDocument();
  });
  test("should render its children if policy is consented to in cookies", () => {
    window.localStorage.setItem(
      "metomic-consented-pol:b109d120-ec88-4dd7-9f6e-fc67ab6f0ffb",
      JSON.stringify({ enabled: true })
    );
    const { queryByText } = render(
      <CookieConsentGate serviceType="bugsnag">
        <div>child</div>
      </CookieConsentGate>,
      { wrapper: CookieConsentProvider }
    );

    expect(queryByText("child")).toBeInTheDocument();
  });
});
