import { screen, within } from "@testing-library/react";

import AppHeaderBurgerMenuSections from "./AppHeaderBurgerMenuSections";

import renderWithTheme from "@/__tests__/__helpers__/renderWithTheme";
import { burgerMenuSections } from "@/browser-lib/fixtures/burgerMenuSections";

describe("AppHeaderBurgerburgerMenuSections", () => {
  it("renders 3 burger menu sections", () => {
    renderWithTheme(
      <AppHeaderBurgerMenuSections burgerMenuSections={burgerMenuSections} />,
    );

    const menuSection = screen.getAllByTestId("menu-section");
    expect(menuSection).toHaveLength(3);
  });

  it("renders a heading and a list in each section", () => {
    renderWithTheme(
      <AppHeaderBurgerMenuSections burgerMenuSections={burgerMenuSections} />,
    );

    const menuSections = screen.getAllByTestId("menu-section");
    const firstSection = menuSections[0];
    const header = within(firstSection!).getByRole("heading");
    expect(header).toBeInTheDocument();
    const list = within(firstSection!).getByRole("list");
    expect(list).toBeInTheDocument();
  });
});
