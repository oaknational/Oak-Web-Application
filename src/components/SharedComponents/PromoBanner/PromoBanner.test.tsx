import { OakPromoTag } from "@oaknational/oak-components";

import PromoBanner, { PromoBannerProps } from "./PromoBanner";

import renderWithProviders from "@/__tests__/__helpers__/renderWithProviders";

describe("HomePageBanner", () => {
  const defaultProps: PromoBannerProps = {
    background: "lemon",
    message: (
      <div>
        <OakPromoTag /> Subjects added
      </div>
    ),
    ctaText: "See curriculum plans",
    page: "curriculum-landing-page",
  };

  const render = renderWithProviders();
  it("should render the banner component with correct structure", () => {
    const { getByRole, getByText } = render(<PromoBanner {...defaultProps} />);

    const banner = getByRole("banner");
    expect(banner).toBeInTheDocument();
    expect(getByText("New")).toBeInTheDocument();
    expect(banner).toContainElement(getByRole("link"));
    expect(banner).toContainElement(getByText("Subjects added"));
  });

  it("should render the button with correct props", () => {
    const { getByRole, getByText } = render(<PromoBanner {...defaultProps} />);

    const link = getByRole("link");

    expect(link).toHaveAttribute("href", "/teachers/curriculum");
    expect(link).toHaveAttribute("title", "See curriculum plans");
    expect(getByText("See curriculum plans")).toBeInTheDocument();
  });

  it("should render custom newText and ctaText correctly", () => {
    const customProps = {
      ...defaultProps,
      message: "New feature available",
      ctaText: "Try it now",
    };

    const { getByRole, getByText } = render(<PromoBanner {...customProps} />);

    expect(getByText("New feature available")).toBeInTheDocument();
    const link = getByRole("link");
    expect(getByText("Try it now")).toBeInTheDocument();
    expect(link).toHaveAttribute("title", "Try it now");
  });

  it("should support different page types for the CTA link", () => {
    const { getByRole } = render(
      <PromoBanner {...defaultProps} ctaText="Go to test" />,
    );

    const link = getByRole("link");
    expect(link).toHaveAttribute("href");
    expect(link.getAttribute("href")).not.toBe("");
    expect(link).toHaveAttribute("title", `Go to test`);
  });

  it("should handle OakColor backgrounds", () => {
    const colors = ["white", "black", "mint", "lavender", "pink"] as const;

    colors.forEach((color) => {
      const { getByRole, unmount } = render(
        <PromoBanner {...defaultProps} background={color} />,
      );

      const banner = getByRole("banner");
      expect(banner).toBeInTheDocument();

      expect(getByRole("link")).toBeInTheDocument();

      unmount();
    });
  });
});
