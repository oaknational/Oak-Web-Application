import { OakThemeProvider, oakDefaultTheme } from "@oaknational/oak-components";

import { CopyrightNotice } from "./CopyrightNotice";

import renderWithTheme from "@/__tests__/__helpers__/renderWithTheme";
import { resolveOakHref } from "@/common-lib/urls";

describe(CopyrightNotice, () => {
  it("displays the legacy licence when `isLegacyLicence` is true", () => {
    const { queryByText, getByRole } = renderWithTheme(
      <OakThemeProvider theme={oakDefaultTheme}>
        <CopyrightNotice isLegacyLicense />
      </OakThemeProvider>,
    );

    expect(
      queryByText(
        /This content is made available by Oak National Academy Limited and its partners/,
      ),
    ).toBeInTheDocument();
    expect(
      getByRole("link", { name: /Oak's terms & conditions/ }),
    ).toHaveAttribute(
      "href",
      resolveOakHref({
        page: "legal",
        legalSlug: "terms-and-conditions",
      }),
    );
  });

  it("displays the current licence when `isLegacyLicence` is false", () => {
    const { queryByText, getByRole } = renderWithTheme(
      <OakThemeProvider theme={oakDefaultTheme}>
        <CopyrightNotice isLegacyLicense={false} />
      </OakThemeProvider>,
    );

    expect(
      queryByText(/This content is © Oak National Academy Limited/),
    ).toBeInTheDocument();
    expect(
      getByRole("link", { name: /Oak's terms & conditions/ }),
    ).toHaveAttribute(
      "href",
      resolveOakHref({
        page: "legal",
        legalSlug: "terms-and-conditions",
      }),
    );
    expect(
      getByRole("link", { name: /Open Government Licence version 3.0/ }),
    ).toHaveAttribute(
      "href",
      "https://www.nationalarchives.gov.uk/doc/open-government-licence/version/3/",
    );
  });
});
