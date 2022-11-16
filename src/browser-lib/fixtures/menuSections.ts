import { MenuSections } from "../../components/MenuLinks/types";

export const menuSections: MenuSections = {
  large: [
    {
      page: "home",
      linkText: "Home",
    },
    {
      page: "teachers-home",
      linkText: "Teacher hub",
    },
    {
      page: "pupils-home",
      linkText: "Classroom",
    },
  ],
  medium: [
    {
      page: "lesson-planning",
      linkText: "Plan a lesson",
    },
    {
      page: "develop-your-curriculum",
      linkText: "Develop your curriculum",
    },
  ],
  small: [
    {
      page: "blog-index",
      linkText: "Blog",
    },
    {
      page: "webinars-index",
      linkText: "Webinars",
    },
    {
      page: "about-who-we-are",
      activeLinkHrefMatch: "/about-us",
      linkText: "About us",
    },
    {
      page: "contact",
      linkText: "Contact us",
    },
    {
      page: "help-home",
      linkText: "Help",
    },
  ],
};
