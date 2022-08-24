import renderWithProviders from "../../__tests__/__helpers__/renderWithProviders";

import MenuLinks from "./MenuLinks";
import { MenuListElementProps } from "./types";

describe("MenuLinks", () => {
  test("should render a list of links", () => {
    const menuLinks: Omit<MenuListElementProps, "currentPath">[] = [
      {
        href: "https://teachers.thenational.academy",
        linkText: "Teacher hub",
        fontFamily: "heading",
        fontSize: [32],
        $mt: [20],
      },
      {
        href: "https://classroom.thenational.academy/",
        linkText: "Classroom",
        fontSize: [32],
        fontFamily: "heading",
        $mt: [16],
      },
    ];

    const { getByText } = renderWithProviders(
      <MenuLinks menuLinks={menuLinks} currentPath={"/"} />
    );
    menuLinks.forEach(({ linkText }) => {
      getByText(linkText);
    });
  });
  test("should position the arrow based on the current path", () => {
    const menuLinks: Omit<MenuListElementProps, "currentPath">[] = [
      {
        href: "/develop-the-curriculum",
        linkText: "Develop Your Curriculum",
        fontFamily: "heading",
        fontSize: [32],
        $mt: [20],
      },
      {
        href: "/blog",
        linkText: "Blogs",
        fontSize: [32],
        fontFamily: "heading",
        $mt: [16],
      },
      {
        href: "/plan-a-lesson",
        linkText: "Plan A Lesson",
        fontSize: [32],
        fontFamily: "heading",
        $mt: [16],
      },
    ];

    const { getByText } = renderWithProviders(
      <MenuLinks menuLinks={menuLinks} currentPath={"/blog"} />
    );
    const blogsLink = getByText("Blogs");
    const arrowIcon =
      blogsLink.parentElement?.previousElementSibling?.firstElementChild
        ?.firstElementChild;

    expect(arrowIcon).toBeInTheDocument();
    expect(arrowIcon?.nodeName).toBe("svg");
  });
});
