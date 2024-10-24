import { render } from "@testing-library/react";
import { ThemeProvider } from "styled-components";

import HomePageBanner, { HomePageBannerProps } from "./Banner";

import oakDefaultTheme from "@/styles/theme";

describe("HomePageBanner", () => {
  const defaultProps: HomePageBannerProps = {
    background: "lemon",
    newText: "Subjects added",
    ctaText: "See curriculum plans",
    page: "curriculum-landing-page",
  };

  const renderBanner = (props = defaultProps) => {
    return render(
      <ThemeProvider theme={oakDefaultTheme}>
        <HomePageBanner {...props} />
      </ThemeProvider>,
    );
  };

  it("should render the banner component with correct structure", () => {
    const { getByRole, getByTestId, getByText } = renderBanner();

    const banner = getByRole("banner");
    expect(banner).toBeInTheDocument();
    expect(getByTestId("new-icon")).toBeInTheDocument();
    expect(banner).toContainElement(getByRole("link"));
    expect(banner).toContainElement(getByText("Subjects added"));
    expect(getByTestId("hr")).toBeInTheDocument();
  });

  it("should display the New promo tag and its associated text", () => {
    const { getByTestId, getByText } = renderBanner();

    const newIcon = getByTestId("new-icon");
    expect(newIcon).toHaveAttribute("aria-hidden", "true");

    // Check SVG sibling div contains "New" text
    const svg = newIcon.querySelector("svg");
    expect(svg).toBeInTheDocument();
    const divAfterSvg = svg?.nextElementSibling as HTMLElement;
    const spanInDiv = divAfterSvg?.querySelector("span");
    expect(spanInDiv).toHaveTextContent("New");

    expect(getByText("Subjects added")).toBeInTheDocument();
  });

  it("should render the button with correct props", () => {
    const { getByRole, getByText } = renderBanner();

    const link = getByRole("link");

    expect(link).toHaveAttribute("href", "/teachers/curriculum");
    expect(link).toHaveAttribute("title", "See curriculum plans");
    expect(getByText("See curriculum plans")).toBeInTheDocument();
  });

  it("should render all SVG elements correctly", () => {
    const { getByTestId } = renderBanner();
    // Check promotional tag SVG
    const tagSvg = getByTestId("new-icon").querySelector("svg");
    expect(tagSvg).toHaveAttribute("aria-hidden", "true");
    expect(tagSvg).toHaveAttribute("name", "tag-promotional");

    // Check chevron SVG
    const buttonIcon = getByTestId("button-icon");
    const chevronSvg = buttonIcon.querySelector('svg[name="chevron-right"]');
    expect(chevronSvg).toBeInTheDocument();
    expect(chevronSvg).toHaveAttribute("aria-hidden", "true");
  });

  it("should render custom newText and ctaText correctly", () => {
    const customProps = {
      ...defaultProps,
      newText: "New feature available",
      ctaText: "Try it now",
    };

    const { getByRole, getByText } = renderBanner(customProps);

    expect(getByText("New feature available")).toBeInTheDocument();
    const link = getByRole("link");
    expect(getByText("Try it now")).toBeInTheDocument();
    expect(link).toHaveAttribute("title", "Try it now");
  });

  it("should support different page types for the CTA link", () => {
    const { getByRole } = renderBanner({
      ...defaultProps,
      page: "curriculum-landing-page",
      ctaText: `Go to test`,
    });

    const link = getByRole("link");
    expect(link).toHaveAttribute("href");
    expect(link.getAttribute("href")).not.toBe("");
    expect(link).toHaveAttribute("title", `Go to test`);
  });

  it("should handle OakColor backgrounds", () => {
    const colors = ["white", "black", "mint", "lavender", "pink"] as const;

    colors.forEach((color) => {
      const { getByRole, getByText, getByTestId, unmount } = renderBanner({
        ...defaultProps,
        background: color,
      });

      const banner = getByRole("banner");
      expect(banner).toBeInTheDocument();

      expect(getByTestId("new-icon")).toBeInTheDocument();
      expect(getByText(defaultProps.newText)).toBeInTheDocument();
      expect(getByRole("link")).toBeInTheDocument();

      unmount();
    });
  });
});
