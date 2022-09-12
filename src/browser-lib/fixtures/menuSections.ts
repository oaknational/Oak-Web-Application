import { MenuSections } from "../../components/MenuLinks/types";

export const menuSections: MenuSections = {
  large: [
    {
      href: "/",
      linkText: "Home",
    },
    {
      href: "https://teachers.thenational.academy",
      linkText: "Teacher hub",
    },
    {
      href: "https://classroom.thenational.academy",
      linkText: "Classroom",
    },
  ],
  medium: [
    {
      href: "/lesson-planning",
      linkText: "Plan a lesson",
    },
    {
      href: "/develop-your-curriculum",
      linkText: "Develop your curriculum",
    },
  ],
  small: [
    {
      href: "/blog",
      linkText: "Blog",
    },
    {
      href: "/about-us/who-we-are",
      activeLinkHrefMatch: "/about-us",
      linkText: "About us",
    },
    {
      href: "/contact-us",
      linkText: "Contact us",
    },
    {
      href: "https://support.thenational.academy",
      linkText: "Help",
    },
  ],
};
