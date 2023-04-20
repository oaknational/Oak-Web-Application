import { MenuSections } from "../../components/MenuLinks/types";

export const menuSections: MenuSections = {
  large: [
    {
      page: "home",
      linkText: "Home (early access)",
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
    {
      page: "support-your-team",
      linkText: "Support your team",
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
