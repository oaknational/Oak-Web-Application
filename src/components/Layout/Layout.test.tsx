import { screen } from "@testing-library/react";

import renderWithProviders from "../../__tests__/__helpers__/renderWithProviders";

import Layout from "./Layout";

describe("Layout", () => {
  it("renders a header", () => {
    renderWithProviders(<Layout />);

    const header = screen.getByRole("banner");

    expect(header).toBeInTheDocument();
  });
  it("renders a main", () => {
    renderWithProviders(<Layout />);

    const main = screen.getByRole("main");

    expect(main).toBeInTheDocument();
  });
});
