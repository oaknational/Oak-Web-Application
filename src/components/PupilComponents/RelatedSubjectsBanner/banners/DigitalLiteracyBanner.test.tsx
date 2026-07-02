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

describe("DigitalLiteracyBanner", () => {
  const programmeFields = unitBrowseDataFixture({}).programmeFields;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders the banner with the correct OakCard props", () => {
    renderWithTheme(
      <OakThemeProvider theme={oakDefaultTheme}>
        <DigitalLiteracyBanner programmeFields={programmeFields} />
      </OakThemeProvider>,
    );

    expect(screen.getByTestId("digital-literacy-banner")).toBeInTheDocument();

    const card = screen.getByTestId("oak-card");
    expect(card).toBeInTheDocument();
    expect(card).toHaveAttribute(
      "data-href",
      "/pupil-unit-index/pupil-unit-index/digital-literacy-primary-year-1",
    );
    expect(card).toHaveAttribute("data-heading-level", "h1");
    expect(card).toHaveAttribute("data-card-width", "100%");
    expect(card).toHaveAttribute(
      "data-image-src",
      "/icons/subject-digital-literacy.svg",
    );
    expect(card).toHaveAttribute("data-sub-copy-color", "text-primary");
    expect(card).toHaveAttribute("data-tag-background", "bg-decorative1-main");
    expect(card).toHaveAttribute("data-link-icon-name", "chevron-right");

    expect(screen.getByTestId("heading")).toHaveTextContent(
      "Check out our new digital literacy lessons!",
    );
    expect(screen.getByTestId("image-alt")).toHaveTextContent(
      "Illustration representing digital literacy",
    );
    expect(screen.getByTestId("sub-copy")).toHaveTextContent(
      "Learn fun and easy ways to use technology confidently and safely in real life.",
    );
    expect(screen.getByTestId("link-text")).toHaveTextContent(
      "Go to new digital literacy lessons",
    );
  });
});
