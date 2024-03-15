import { screen, within } from "@testing-library/react";

import AppHeaderBurgerMenuSections from "./AppHeaderBurgerMenuSections";

import renderWithTheme from "@/__tests__/__helpers__/renderWithTheme";
import { menuSections } from "@/browser-lib/fixtures/menuSections";

describe("AppHeaderBurgerMenuSections", () => {
  it("renders 3 menu sections", () => {
    renderWithTheme(
      <AppHeaderBurgerMenuSections menuSections={menuSections} />,
    );

    const menuSection = screen.getAllByTestId("menu-section");
    expect(menuSection).toHaveLength(3);
  });
  it("renders a heading and a list in each section", () => {
    renderWithTheme(
      <AppHeaderBurgerMenuSections menuSections={menuSections} />,
    );

    const menuSections = screen.getAllByTestId("menu-section");
    const firstSection = menuSections[0];
    const header = within(firstSection!).getByRole("heading");
    expect(header).toBeInTheDocument();
    const list = within(firstSection!).getByRole("list");
    expect(list).toBeInTheDocument();
  });
});
