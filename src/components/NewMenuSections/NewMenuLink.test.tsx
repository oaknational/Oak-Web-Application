import { screen } from "@testing-library/react";

import NewMenuLink from "./NewMenuLink";

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
    renderWithTheme(<NewMenuLink link={link} />);

    const menuLink = screen.getByRole("link");
    expect(menuLink).toBeInTheDocument();
  });
  it("displays an icon when the link is external", () => {
    renderWithTheme(<NewMenuLink link={link} />);
    const externalIcon = screen.queryByTestId("icon");
    expect(externalIcon).toBeInTheDocument();
  });
  it("displays no icon when the link is internal", () => {
    renderWithTheme(<NewMenuLink link={{ ...link, external: false }} />);
    const externalIcon = screen.queryByTestId("icon");
    expect(externalIcon).not.toBeInTheDocument();
  });
  it("displays new tag when it should", () => {
    renderWithTheme(<NewMenuLink link={link} />);
    const newTag = screen.getByText("New");
    expect(newTag).toBeInTheDocument();
  });
  it("does not display new tag when it should not", () => {
    renderWithTheme(<NewMenuLink link={{ ...link, new: false }} />);
    const newTag = screen.queryByText("New");
    expect(newTag).not.toBeInTheDocument();
  });
});
