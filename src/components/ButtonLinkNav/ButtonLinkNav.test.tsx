import mockRouter from "next-router-mock";

import renderWithTheme from "../../__tests__/__helpers__/renderWithTheme";

import ButtonLinkNav from "./ButtonLinkNav";

jest.mock("next/dist/client/router", () => require("next-router-mock"));

const buttons = [
  { label: "First one", href: "/first-one" },
  { label: "Second one", href: "/second-one" },
  { label: "Third one", href: "/third-one" },
];

describe("ButtonLinkNav", () => {
  beforeEach(() => {
    mockRouter.setCurrentUrl("/first-one");
  });
  test("renders links with correct hrefs and labels", () => {
    const { getAllByRole } = renderWithTheme(
      <ButtonLinkNav ariaLabel="testing 123" buttons={buttons} />
    );

    const links = getAllByRole("link");
    buttons.forEach((button) => {
      const matchingLink = links.find(
        (link) => link.getAttribute("href") === button.href
      );

      expect(matchingLink).toHaveAttribute("href", button.href);
      expect(matchingLink).toHaveAccessibleName(button.label);
    });
  });
  test("renders nav with correct a11y label", () => {
    const { getByRole } = renderWithTheme(
      <ButtonLinkNav ariaLabel="testing 123" buttons={buttons} />
    );
    const nav = getByRole("navigation");
    expect(nav).toHaveAccessibleName("testing 123");
  });
  test("only 'current' link has aria-current='page'", () => {
    mockRouter.setCurrentUrl("/second-one");

    const { getByRole } = renderWithTheme(
      <ButtonLinkNav ariaLabel="testing 123" buttons={buttons} />
    );
    const currentLink = getByRole("link", { name: "Second one" });
    expect(currentLink).toHaveAttribute("aria-current", "page");
    const otherLink = getByRole("link", { name: "Third one" });
    expect(otherLink).not.toHaveAttribute("aria-current");
  });
});
