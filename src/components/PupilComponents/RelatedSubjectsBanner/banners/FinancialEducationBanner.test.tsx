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

// Only mock OakCard while keeping other Oak components as they are.
jest.mock("@oaknational/oak-components", () => {
  const actualComponents = jest.requireActual("@oaknational/oak-components");
  return {
    ...actualComponents,
    generateOakIconURL: jest.fn((iconName) => `/icons/${iconName}.svg`),
    OakCard: jest.fn(
      ({
        heading,
        headingLevel,
        href,
        cardWidth,
        imageSrc,
        imageAlt,
        subCopy,
        subCopyColor,
        tagName,
        tagBackground,
        linkText,
        linkIconName,
      }) => (
        <div
          data-testid="oak-card"
          data-href={href}
          data-heading-level={headingLevel}
          data-card-width={cardWidth}
          data-image-src={imageSrc}
          data-sub-copy-color={subCopyColor}
          data-tag-background={tagBackground}
          data-link-icon-name={linkIconName}
        >
          <span data-testid="heading">{heading}</span>
          <span data-testid="image-alt">{imageAlt}</span>
          <span data-testid="sub-copy">{subCopy}</span>
          <span data-testid="tag-name">{tagName}</span>
          <span data-testid="link-text">{linkText}</span>
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

  it("renders the banner with the correct OakCard props", () => {
    renderWithTheme(
      <OakThemeProvider theme={oakDefaultTheme}>
        <FinancialEducationBanner programmeFields={programmeFields} />
      </OakThemeProvider>,
    );

    // Verify that the outer banner element is rendered
    expect(
      screen.getByTestId("financial-education-banner"),
    ).toBeInTheDocument();

    // Verify the mocked OakCard received the correct href and display props
    const card = screen.getByTestId("oak-card");
    expect(card).toBeInTheDocument();
    expect(card).toHaveAttribute(
      "data-href",
      "/pupil-unit-index/pupil-unit-index/financial-education-primary-year-1",
    );
    expect(card).toHaveAttribute("data-heading-level", "h1");
    expect(card).toHaveAttribute("data-card-width", "100%");
    expect(card).toHaveAttribute(
      "data-image-src",
      "/icons/subject-financial-education.svg",
    );
    expect(card).toHaveAttribute("data-sub-copy-color", "text-primary");
    expect(card).toHaveAttribute("data-tag-background", "bg-decorative1-main");
    expect(card).toHaveAttribute("data-link-icon-name", "chevron-right");

    expect(screen.getByTestId("heading")).toHaveTextContent(
      "Check out our new finance lessons!",
    );
    expect(screen.getByTestId("image-alt")).toHaveTextContent(
      "Illustration of persons head with finance ideas",
    );
    expect(screen.getByTestId("sub-copy")).toHaveTextContent(
      "Learn fun and easy ways to understand money and how to use it in real life.",
    );
    expect(screen.getByTestId("tag-name")).toHaveTextContent("New");
    expect(screen.getByTestId("link-text")).toHaveTextContent(
      "Go to new finance lessons",
    );
  });
});
