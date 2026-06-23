import { screen } from "@testing-library/react";
import { oakDefaultTheme, OakThemeProvider } from "@oaknational/oak-components";

import DigitalLiteracyBanner from "./DigitalLiteracyBanner";

import { unitBrowseDataFixture } from "@/node-lib/curriculum-api-2023/fixtures/unitBrowseData.fixture";
import renderWithTheme from "@/__tests__/__helpers__/renderWithTheme";

jest.mock("@/common-lib/urls", () => ({
  resolveOakHref: jest.fn(
    ({ page, programmeSlug }) => `/${page}/pupil-unit-index/${programmeSlug}`,
  ),
}));

jest.mock("@oaknational/oak-components", () => {
  const actualComponents = jest.requireActual("@oaknational/oak-components");
  return {
    ...actualComponents,
    OakLinkCard: jest.fn(
      ({ mainSection, iconName, iconAlt, href, showNew }) => (
        <div data-testid="oak-link-card" data-href={href}>
          {mainSection}
          <span data-testid="icon-name">{iconName}</span>
          <span data-testid="icon-alt">{iconAlt}</span>
          <span data-testid="show-new">{showNew ? "true" : "false"}</span>
        </div>
      ),
    ),
  };
});

describe("DigitalLiteracyBanner", () => {
  const programmeFields = unitBrowseDataFixture({}).programmeFields;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders the banner with the correct OakLinkCard props", () => {
    renderWithTheme(
      <OakThemeProvider theme={oakDefaultTheme}>
        <DigitalLiteracyBanner programmeFields={programmeFields} />
      </OakThemeProvider>,
    );

    expect(screen.getByTestId("digital-literacy-banner")).toBeInTheDocument();

    const card = screen.getByTestId("oak-link-card");
    expect(card).toBeInTheDocument();
    expect(card).toHaveAttribute(
      "data-href",
      "/pupil-unit-index/pupil-unit-index/digital-literacy-primary-year-1",
    );

    expect(screen.getByTestId("icon-name")).toHaveTextContent(
      "subject-digital-literacy",
    );
    expect(screen.getByTestId("icon-alt")).toHaveTextContent(
      "Illustration representing digital literacy",
    );
    expect(screen.getByTestId("show-new")).toHaveTextContent("true");
  });
});
