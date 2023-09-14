import { screen, within } from "@testing-library/react";

import NewMenuLinks from "./NewMenuSections";

import renderWithTheme from "@/__tests__/__helpers__/renderWithTheme";
import { newBetaMenuSections } from "@/browser-lib/fixtures/betaMenuSections";

describe("NewMenuLinks", () => {
  it("renders 3 menu sections", () => {
    renderWithTheme(<NewMenuLinks menuSections={newBetaMenuSections} />);

    const menuSection = screen.getAllByTestId("menu-section");
    expect(menuSection).toHaveLength(3);
  });
  it("renders a heading and a list in each section", () => {
    renderWithTheme(<NewMenuLinks menuSections={newBetaMenuSections} />);

    const menuSections = screen.getAllByTestId("menu-section");
    const firstSection = menuSections[0];
    const header = within(firstSection!).getByRole("heading");
    expect(header).toBeInTheDocument();
    const list = within(firstSection!).getByRole("list");
    expect(list).toBeInTheDocument();
  });
});
