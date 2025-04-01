import { screen } from "@testing-library/react";
import { oakDefaultTheme, OakThemeProvider } from "@oaknational/oak-components";

import FinancialEducationBanner from "./FinancialEducationBanner";

import { unitBrowseDataFixture } from "@/node-lib/curriculum-api-2023/fixtures/unitBrowseData.fixture";
import renderWithTheme from "@/__tests__/__helpers__/renderWithTheme";

// Mock resolveOakHref to generate a predictable URL
jest.mock("@/common-lib/urls", () => ({
  resolveOakHref: jest.fn(
    ({ page, programmeSlug }) => `/${page}/pupil-unit-index/${programmeSlug}`,
  ),
}));

// Only mock OakLinkCard while keeping other Oak components as they are.
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

describe("FinancialEducationBanner", () => {
  const programmeFields = unitBrowseDataFixture({}).programmeFields;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders the banner with the correct OakLinkCard props", () => {
    renderWithTheme(
      <OakThemeProvider theme={oakDefaultTheme}>
        <FinancialEducationBanner programmeFields={programmeFields} />
      </OakThemeProvider>,
    );

    // Verify that the outer banner element is rendered
    expect(
      screen.getByTestId("financial-education-banner"),
    ).toBeInTheDocument();

    // Verify the mocked OakLinkCard received the correct href
    const card = screen.getByTestId("oak-link-card");
    expect(card).toBeInTheDocument();
    expect(card).toHaveAttribute(
      "data-href",
      "/pupil-unit-index/pupil-unit-index/financial-education-secondary-year-1",
    );

    expect(screen.getByTestId("icon-name")).toHaveTextContent(
      "subject-financial-education",
    );
    expect(screen.getByTestId("icon-alt")).toHaveTextContent(
      "Illustration of persons head with finance ideas",
    );
    expect(screen.getByTestId("show-new")).toHaveTextContent("true");
  });
});
