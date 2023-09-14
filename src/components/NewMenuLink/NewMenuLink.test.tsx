// TODO:
// displays a link
// shows new icon
// shows external icon

import { screen } from "@testing-library/react";

import renderWithTheme from "../../__tests__/__helpers__/renderWithTheme";

import NewMenuLink from "./NewMenuLink";

import { ResolveOakHrefProps } from "@/common-lib/urls";


const link = {
  resolveOakHrefProps: {
    page: "home",
    viewType: "teachers-2023",
  } as ResolveOakHrefProps, // TODO: not as cast
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
});
