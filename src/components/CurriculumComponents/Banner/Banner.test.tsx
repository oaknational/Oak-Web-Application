import { render, screen } from "@testing-library/react";
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
    renderBanner();

    const banner = screen.getByRole("banner");
    expect(banner).toBeInTheDocument();
    expect(screen.getByTestId("new-icon")).toBeInTheDocument();
    expect(banner).toContainElement(screen.getByRole("link"));
    expect(banner).toContainElement(screen.getByText("Subjects added"));
    expect(screen.getByTestId("hr")).toBeInTheDocument();
  });

  it("should display the New promo tag and its associated text", () => {
    renderBanner();

    const newIcon = screen.getByTestId("new-icon");
    expect(newIcon).toHaveAttribute("aria-hidden", "true");

    // Check SVG sibling div contains "New" text
    const svg = newIcon.querySelector("svg");
    expect(svg).toBeInTheDocument();
    const divAfterSvg = svg?.nextElementSibling as HTMLElement;
    const spanInDiv = divAfterSvg?.querySelector("span");
    expect(spanInDiv).toHaveTextContent("New");

    expect(screen.getByText("Subjects added")).toBeInTheDocument();
  });

  it("should render the button with correct props", () => {
    renderBanner();

    const link = screen.getByRole("link");

    expect(link).toHaveAttribute("href", "/teachers/curriculum");
    expect(link).toHaveAttribute("title", "See curriculum plans");
    expect(screen.getByText("See curriculum plans")).toBeInTheDocument();
  });

  it("should render all SVG elements correctly", () => {
    renderBanner();
    // Check promotional tag SVG
    const tagSvg = screen.getByTestId("new-icon").querySelector("svg");
    expect(tagSvg).toHaveAttribute("aria-hidden", "true");
    expect(tagSvg).toHaveAttribute("name", "tag-promotional");

    // Check chevron SVG
    const buttonIcon = screen.getByTestId("button-icon");
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

    renderBanner(customProps);

    expect(screen.getByText("New feature available")).toBeInTheDocument();
    const link = screen.getByRole("link");
    expect(screen.getByText("Try it now")).toBeInTheDocument();
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
      const { unmount } = renderBanner({
        ...defaultProps,
        background: color,
      });

      const banner = screen.getByRole("banner");
      expect(banner).toBeInTheDocument();

      expect(screen.getByTestId("new-icon")).toBeInTheDocument();
      expect(screen.getByText(defaultProps.newText)).toBeInTheDocument();
      expect(screen.getByRole("link")).toBeInTheDocument();

      unmount();
    });
  });
});
