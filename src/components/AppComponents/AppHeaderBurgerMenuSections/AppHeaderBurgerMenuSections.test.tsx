import { screen, within } from "@testing-library/react";

import AppHeaderBurgerMenuSections from "./AppHeaderBurgerMenuSections";

import { burgerMenuSections } from "@/browser-lib/fixtures/burgerMenuSections";
import renderWithProviders from "@/__tests__/__helpers__/renderWithProviders";

describe("AppHeaderBurgerburgerMenuSections", () => {
  beforeEach(() => {});

  it("renders 3 burger menu sections", () => {
    renderWithProviders()(
      <AppHeaderBurgerMenuSections burgerMenuSections={burgerMenuSections} />,
    );

    const menuSection = screen.getAllByTestId("menu-section");
    expect(menuSection).toHaveLength(3);
  });

  it("renders a heading and a list in each section", () => {
    renderWithProviders()(
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
