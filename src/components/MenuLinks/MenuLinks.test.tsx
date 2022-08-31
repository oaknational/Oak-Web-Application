import { getPupilsUrl, getTeachersUrl } from "../../common-lib/urls";
import renderWithProviders from "../../__tests__/__helpers__/renderWithProviders";

import MenuLinks from "./MenuLinks";
import { MenuListItemProps } from "./types";

describe("MenuLinks", () => {
  test("should render a list of links", () => {
    const menuLinks: Omit<MenuListItemProps, "currentPath">[] = [
      {
        href: getTeachersUrl(),
        linkText: "Teacher hub",
        fontFamily: "heading",
        fontSize: [32],
        $mt: [20],
        arrowSize: [32],
      },
      {
        href: getPupilsUrl(),
        linkText: "Classroom",
        fontSize: [32],
        fontFamily: "heading",
        $mt: [16],
        arrowSize: [32],
      },
    ];

    const { getByText } = renderWithProviders(
      <MenuLinks menuLinks={menuLinks} currentPath={"/"} />
    );
    menuLinks.forEach(({ linkText }) => {
      getByText(linkText);
    });
  });
  test("will position the arrow at home", () => {
    const menuLinks: Omit<MenuListItemProps, "currentPath">[] = [
      {
        href: "/develop-the-curriculum",
        linkText: "Develop Your Curriculum",
        fontFamily: "heading",
        fontSize: [32],
        $mt: [20],
        arrowSize: [32],
      },
      {
        href: "/blog",
        linkText: "Blogs",
        fontSize: [32],
        fontFamily: "heading",
        $mt: [16],
        arrowSize: [32],
      },
      {
        href: "/plan-a-lesson",
        linkText: "Plan A Lesson",
        fontSize: [32],
        fontFamily: "heading",
        $mt: [16],
        arrowSize: [32],
      },
    ];

    const { getByTestId, container } = renderWithProviders(
      <MenuLinks menuLinks={menuLinks} currentPath={"/"} />
    );
    const blogsLink = getByTestId("home-link");
    const svgs = blogsLink.getElementsByTagName("svg");
    expect(svgs.length).toBe(1);

    const allSvgs = container.getElementsByTagName("svg");
    expect(allSvgs.length).toBe(1);
  });
  test("should position the arrow based on the current path", () => {
    const menuLinks: Omit<MenuListItemProps, "currentPath">[] = [
      {
        href: "/develop-the-curriculum",
        linkText: "Develop Your Curriculum",
        fontFamily: "heading",
        fontSize: [32],
        $mt: [20],
        arrowSize: [32],
      },
      {
        href: "/blog",
        linkText: "Blogs",
        fontSize: [32],
        fontFamily: "heading",
        $mt: [16],
        arrowSize: [32],
      },
      {
        href: "/plan-a-lesson",
        linkText: "Plan A Lesson",
        fontSize: [32],
        fontFamily: "heading",
        $mt: [16],
        arrowSize: [32],
      },
    ];

    const { getByTestId, container } = renderWithProviders(
      <MenuLinks menuLinks={menuLinks} currentPath={"/blog"} />
    );
    const blogsLink = getByTestId("blog-link");
    const svgs = blogsLink.getElementsByTagName("svg");
    expect(svgs.length).toBe(1);

    const allSvgs = container.getElementsByTagName("svg");
    expect(allSvgs.length).toBe(1);
  });
});
