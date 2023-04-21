import { MenuSections } from "../../components/MenuLinks/types";

export const menuSections: MenuSections = {
  large: [
    {
      resolveOakHrefProps: { page: "home", viewType: null },
      linkText: "Home",
    },
    {
      resolveOakHrefProps: { page: "teacher-hub" },
      linkText: "Teacher hub",
    },
    {
      resolveOakHrefProps: { page: "classroom" },
      linkText: "Classroom",
    },
  ],
  medium: [
    {
      resolveOakHrefProps: { page: "lesson-planning" },
      linkText: "Plan a lesson",
    },
    {
      resolveOakHrefProps: { page: "develop-your-curriculum" },
      linkText: "Develop your curriculum",
    },
    {
      resolveOakHrefProps: { page: "support-your-team" },
      linkText: "Support your team",
    },
  ],
  small: [
    {
      resolveOakHrefProps: { page: "blog-index" },
      linkText: "Blog",
    },
    {
      resolveOakHrefProps: { page: "webinar-index" },
      linkText: "Webinars",
    },
    {
      resolveOakHrefProps: { page: "about-who-we-are" },
      activeLinkHrefMatch: "/about-us",
      linkText: "About us",
    },
    {
      resolveOakHrefProps: { page: "contact" },
      linkText: "Contact us",
    },
    {
      resolveOakHrefProps: { page: "help" },
      linkText: "Help",
    },
  ],
};
