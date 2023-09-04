import { render } from "@testing-library/react";

import CookieConsentProvider from "./CookieConsentProvider";

describe("CookieConsentProvider", () => {
  test("should render its children", () => {
    const { getByTestId } = render(
      <CookieConsentProvider>
        <div data-testid="child" />
      </CookieConsentProvider>,
    );

    expect(getByTestId("child")).toBeInTheDocument();
  });
});
