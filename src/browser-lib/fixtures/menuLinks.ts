import { MenuSections } from "../../components/MenuLinks/types";

export const menuSections: MenuSections = {
  large: [
    {
      // pageName: "",
      //   onClick: () => track.teacherHubSelected({ navigatedFrom: "menu" }),
      href: "",
      linkText: "Teacher hub",

      // fontFamily: "heading",
      // fontSize: [32],
      // $mt: [20],
      // arrowSize: [48],
    },
    {
      //   onClick: () => track.teacherHubSelected({ navigatedFrom: "menu" }),
      href: "https://classroom.thenational.academy",
      linkText: "Classroom",
      // fontSize: [32],
      // fontFamily: "heading",
      // $mt: [16],
      // arrowSize: [48],
    },
  ],
  medium: [
    {
      href: "/lesson-planning",
      linkText: "Plan a lesson",
      // fontSize: [24],
      // fontFamily: "heading",
      // $mt: [32],
      // arrowSize: [30],
    },
    {
      href: "/develop-your-curriculum",
      linkText: "Develop your curriculum",
      // fontSize: [24],
      // fontFamily: "heading",
      // $mt: [12],
      // arrowSize: [30],
    },
  ],
  small: [
    {
      href: "/blog",
      linkText: "Blog",
      // fontSize: [16],
      // fontFamily: "ui",
      // $mt: [32],
      // arrowSize: [20],
    },
    {
      href: "/about-us/who-we-are",
      linkText: "About us",
      // fontSize: [16],
      // fontFamily: "ui",
      // $mt: [8],
      // arrowSize: [20],
    },
    {
      href: "/contact-us",
      linkText: "Contact us",
      // fontSize: [16],
      // fontFamily: "ui",
      // $mt: [8],
      // arrowSize: [20],
    },
    {
      href: "https://support.thenational.academy",
      linkText: "Help",
      // fontSize: [16],
      // fontFamily: "ui",
      // $mt: [8],
      // arrowSize: [20],
    },
  ],
};
