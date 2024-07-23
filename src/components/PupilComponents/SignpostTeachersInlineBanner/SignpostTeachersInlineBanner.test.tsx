import { OakThemeProvider, oakDefaultTheme } from "@oaknational/oak-components";

import SignpostTeachersInlineBanner from "./SignpostTeachersInlineBanner";

import renderWithTheme from "@/__tests__/__helpers__/renderWithTheme";
import { resolveOakHref } from "@/common-lib/urls";

describe(SignpostTeachersInlineBanner, () => {
  it("displays the inline banner", () => {
    const { queryByTestId } = renderWithTheme(
      <OakThemeProvider theme={oakDefaultTheme}>
        <SignpostTeachersInlineBanner />
      </OakThemeProvider>,
    );

    expect(queryByTestId("oak-inline-banner")).toBeInTheDocument();
  });

  it("displays the inline banner with correct link", () => {
    const { getByRole } = renderWithTheme(
      <OakThemeProvider theme={oakDefaultTheme}>
        <SignpostTeachersInlineBanner />
      </OakThemeProvider>,
    );

    expect(getByRole("link", { name: /View resources/ })).toHaveAttribute(
      "href",
      resolveOakHref({
        page: "home",
      }),
    );
  });
});
