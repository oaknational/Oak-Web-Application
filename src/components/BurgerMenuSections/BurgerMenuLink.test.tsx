import { screen } from "@testing-library/react";

import BurgerMenuLink from "./BurgerMenuLink";

import renderWithTheme from "@/__tests__/__helpers__/renderWithTheme";
import { ResolveOakHrefProps } from "@/common-lib/urls";

const link = {
  linkTo: {
    page: "home",
    viewType: "teachers-2023",
  } as ResolveOakHrefProps,
  text: "Home",
  new: true,
  external: true,
};

describe("NewMenuLink", () => {
  it("displays a link", () => {
    renderWithTheme(<BurgerMenuLink link={link} />);

    const menuLink = screen.getByRole("link");
    expect(menuLink).toBeInTheDocument();
  });
  it("displays an icon when the link is external", () => {
    renderWithTheme(<BurgerMenuLink link={link} />);
    const externalIcon = screen.queryByTestId("button-icon");
    expect(externalIcon).toBeInTheDocument();
  });
  it("displays no icon when the link is internal", () => {
    renderWithTheme(<BurgerMenuLink link={{ ...link, external: false }} />);
    const externalIcon = screen.queryByTestId("button-icon");
    expect(externalIcon).not.toBeInTheDocument();
  });
  it("displays new tag when it should", () => {
    renderWithTheme(<BurgerMenuLink link={link} />);
    const newTag = screen.getByText("New");
    expect(newTag).toBeInTheDocument();
  });
  it("does not display new tag when it should not", () => {
    renderWithTheme(<BurgerMenuLink link={{ ...link, new: false }} />);
    const newTag = screen.queryByText("New");
    expect(newTag).not.toBeInTheDocument();
  });
});
