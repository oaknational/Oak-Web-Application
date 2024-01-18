import { describe, expect, it } from "vitest";
import { screen } from "@testing-library/react";

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
});
