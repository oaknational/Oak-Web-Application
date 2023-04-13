import mockRouter from "next-router-mock";

import renderWithProviders from "../../__tests__/__helpers__/renderWithProviders";
import { menuSections } from "../../browser-lib/fixtures/menuSections";
import { resolveOakHref } from "../../common-lib/urls";

import MenuLinks from "./MenuLinks";

jest.mock("next/dist/client/router", () => require("next-router-mock"));

const render = renderWithProviders();

describe("MenuLinks", () => {
  test("should render a list of links", () => {
    const { getByText } = render(<MenuLinks menuSections={menuSections} />);
    Object.values(menuSections).forEach((section) =>
      section.forEach(({ linkText, page }) => {
        const href = resolveOakHref({ page });
        expect(getByText(linkText).closest("a")).toHaveAttribute("href", href);
      })
    );
  });
  test("will position the arrow at home", () => {
    mockRouter.setCurrentUrl("http://localhost:3000/");
    const { getByRole, container } = render(
      <MenuLinks menuSections={menuSections} />
    );
    const link = getByRole("link", { name: /Home/i });
    const li = link.closest("li");

    expect(li).toBeInTheDocument();
    // arrow next to "Home" link
    const svgs = li?.getElementsByTagName("svg");
    expect(svgs?.length).toBe(1);
    // no other arrows
    const allSvgs = container.getElementsByTagName("svg");
    expect(allSvgs.length).toBe(1);
  });
  test("should position the arrow based on the current path", () => {
    mockRouter.setCurrentUrl("http://localhost:3000/about-us/board");
    const { getByRole, container } = render(
      <MenuLinks menuSections={menuSections} />
    );
    const link = getByRole("link", { name: /About us/i });
    const li = link.closest("li");

    expect(li).toBeInTheDocument();
    // arrow next to "About us" link
    const svgs = li?.getElementsByTagName("svg");
    expect(svgs?.length).toBe(1);
    // no other arrows
    const allSvgs = container.getElementsByTagName("svg");
    expect(allSvgs.length).toBe(1);
  });
});
