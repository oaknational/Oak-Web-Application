import renderWithProviders from "../../__tests__/__helpers__/renderWithProviders";
import { menuSections } from "../../browser-lib/fixtures/menuLinks";

import MenuLinks from "./MenuLinks";

describe("MenuLinks", () => {
  test("should render a list of links", () => {
    const { getByText } = renderWithProviders(
      <MenuLinks menuSections={menuSections} />
    );
    Object.values(menuSections).forEach((section) =>
      section.forEach(({ linkText, href }) => {
        expect(getByText(linkText).closest("a")).toHaveAttribute("href", href);
      })
    );
  });
  // test("will position the arrow at home", () => {
  //   const { getByTestId, container } = renderWithProviders(
  //     <MenuLinks menuSections={menuSections} currentPath={"/"} />
  //   );
  //   const blogsLink = getByTestId("home-link");
  //   const svgs = blogsLink.getElementsByTagName("svg");
  //   expect(svgs.length).toBe(1);

  //   const allSvgs = container.getElementsByTagName("svg");
  //   expect(allSvgs.length).toBe(1);
  // });
  // test("should position the arrow based on the current path", () => {
  //   const { getByTestId, container } = renderWithProviders(
  //     <MenuLinks menuSections={menuSections} currentPath={"/blog"} />
  //   );
  //   const blogsLink = getByTestId("blog-link");
  //   const svgs = blogsLink.getElementsByTagName("svg");
  //   expect(svgs.length).toBe(1);

  //   const allSvgs = container.getElementsByTagName("svg");
  //   expect(allSvgs.length).toBe(1);
  // });
});
