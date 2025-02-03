import { screen } from "@testing-library/react";

import AppHeaderBurgerMenuLink from "./AppHeaderBurgerMenuLink";

import renderWithTheme from "@/__tests__/__helpers__/renderWithTheme";
import { ResolveOakHrefProps } from "@/common-lib/urls";

const link = {
  linkTo: {
    page: "home",
  } as ResolveOakHrefProps,
  text: "Home",
  new: true,
  external: true,
};

vi.mock("@/context/Analytics/useAnalytics", () => ({
  __esModule: true,
  default: () => ({
    track: {
      browseRefinedAccessed: vi.fn(),
    },
  }),
}));

describe("AppHeaderBurgerMenuLink", () => {
  it("displays a link", () => {
    renderWithTheme(<AppHeaderBurgerMenuLink link={link} />);

    const menuLink = screen.getByRole("link");
    expect(menuLink).toBeInTheDocument();
  });
  it("displays an icon when the link is external", () => {
    renderWithTheme(<AppHeaderBurgerMenuLink link={link} />);
    const externalIcon = screen.queryByTestId("button-icon");
    expect(externalIcon).toBeInTheDocument();
  });
  it("displays no icon when the link is internal", () => {
    renderWithTheme(
      <AppHeaderBurgerMenuLink link={{ ...link, external: false }} />,
    );
    const externalIcon = screen.queryByTestId("button-icon");
    expect(externalIcon).not.toBeInTheDocument();
  });
  it("displays new tag when it should", () => {
    renderWithTheme(<AppHeaderBurgerMenuLink link={link} />);
    const newTag = screen.getByText("New");
    expect(newTag).toBeInTheDocument();
  });
  it("does not display new tag when it should not", () => {
    renderWithTheme(<AppHeaderBurgerMenuLink link={{ ...link, new: false }} />);
    const newTag = screen.queryByText("New");
    expect(newTag).not.toBeInTheDocument();
  });
});
