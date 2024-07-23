import { oakDefaultTheme, OakThemeProvider } from "@oaknational/oak-components";

import NewContentBanner from "./NewContentBanner";

import renderWithProviders from "@/__tests__/__helpers__/renderWithProviders";

const render = renderWithProviders();

describe("NewContentBanner component", () => {
  it("renders NewContentBanner component", () => {
    const { getByText } = render(
      <OakThemeProvider theme={oakDefaultTheme}>
        <NewContentBanner
          subjectSlug="english-reading-for-pleasure"
          subjectTitle="English"
          programmeSlug=""
          keyStageSlug="ks2"
          isUnitListing={true}
          isLegacy={true}
        />
      </OakThemeProvider>,
    );
    const title = getByText("Switch to our new English teaching resources");

    expect(title).toBeInTheDocument();
  });

  it("sets the correct href attribute for the link", () => {
    const { getByText } = render(
      <NewContentBanner
        subjectSlug="english-reading-for-pleasure"
        subjectTitle="English"
        programmeSlug="english-primary-ks2"
        keyStageSlug="ks2"
        isUnitListing={true}
        isLegacy={true}
      />,
    );

    const linkElement = getByText("Go to English resources").closest("a");

    expect(linkElement).toHaveAttribute(
      "href",
      "/teachers/programmes/english-primary-ks2/units",
    );
  });
});
