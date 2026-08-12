import { act, screen } from "@testing-library/react";

import AppLayout from "./AppLayout";

import { DEFAULT_SEO_PROPS } from "@/browser-lib/seo/Seo";
import renderWithProviders from "@/__tests__/__helpers__/renderWithProviders";
import { topNavFixture } from "@/node-lib/curriculum-api-2023/fixtures/topNav.fixture";

const render = renderWithProviders();

describe("Layout", () => {
  it("renders a header", () => {
    render(
      <AppLayout seoProps={DEFAULT_SEO_PROPS} topNavProps={topNavFixture} />,
    );

    const header = screen.getByRole("banner");

    expect(header).toBeInTheDocument();
  });
  it("renders a main", () => {
    render(
      <AppLayout seoProps={DEFAULT_SEO_PROPS} topNavProps={topNavFixture} />,
    );

    const main = screen.getByRole("main");

    expect(main).toBeInTheDocument();
  });
  it("renders a hidden skip to content button until focused", () => {
    render(
      <AppLayout seoProps={DEFAULT_SEO_PROPS} topNavProps={topNavFixture} />,
    );
    const skipButtonLink = screen.getAllByRole("link", {
      name: "Skip to content",
    })[0];

    expect(skipButtonLink).toBeInTheDocument();

    act(() => {
      skipButtonLink?.focus();
    });

    expect(skipButtonLink).toHaveFocus();
    expect(skipButtonLink).not.toHaveStyle("position: absolute");

    act(() => {
      skipButtonLink?.blur();
    });

    expect(skipButtonLink).not.toHaveFocus();
  });
});
