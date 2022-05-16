import { screen } from "@testing-library/react";

import { DEFAULT_SEO_PROPS } from "../../browser-lib/seo/Seo";
import renderWithProviders from "../../__tests__/__helpers__/renderWithProviders";

import Layout from "./Layout";

describe("Layout", () => {
  it("renders a header", () => {
    renderWithProviders(<Layout seoProps={DEFAULT_SEO_PROPS} />);

    const header = screen.getByRole("banner");

    expect(header).toBeInTheDocument();
  });
  it("renders a main", () => {
    renderWithProviders(<Layout seoProps={DEFAULT_SEO_PROPS} />);

    const main = screen.getByRole("main");

    expect(main).toBeInTheDocument();
  });
});
