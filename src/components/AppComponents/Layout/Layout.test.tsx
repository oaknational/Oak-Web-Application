import { act, screen } from "@testing-library/react";

import Layout from "./Layout";

import { DEFAULT_SEO_PROPS } from "@/browser-lib/seo/Seo";
import renderWithProviders from "@/__tests__/__helpers__/renderWithProviders";

const render = renderWithProviders();

describe("Layout", () => {
  it("renders a header", () => {
    render(<Layout seoProps={DEFAULT_SEO_PROPS} />);

    const header = screen.getByRole("banner");

    expect(header).toBeInTheDocument();
  });
  it("renders a main", () => {
    render(<Layout seoProps={DEFAULT_SEO_PROPS} />);

    const main = screen.getByRole("main");

    expect(main).toBeInTheDocument();
  });
  it("renders a hidden skip to content button until focused", () => {
    render(<Layout seoProps={DEFAULT_SEO_PROPS} />);
    const skipButtonLink = screen.getByText("Skip to content").closest("a");

    if (!skipButtonLink) {
      throw new Error("Could not find filter button");
    }

    act(() => {
      skipButtonLink.focus();
    });
    expect(skipButtonLink).toHaveFocus();
    expect(skipButtonLink).not.toHaveStyle("position: absolute");

    act(() => {
      skipButtonLink.blur();
    });
    expect(skipButtonLink).not.toHaveFocus();
  });
});
