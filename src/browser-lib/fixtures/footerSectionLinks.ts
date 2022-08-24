import { SizeProps } from "../../styles/utils/size";
import { SpacingProps } from "../../styles/utils/spacing";

export type FooterLink = {
  text: string;
  href: string;
};

export type FooterSection = {
  title?: string;
  links?: FooterLink[];
} & SpacingProps &
  SizeProps;

const footerSections: FooterSection[] = [
  {
    title: "Pupils",
    links: [
      { text: "Classroom", href: "https://classroom.thenational.academy/" },
    ],
  },
  {
    title: "Teachers",
    links: [
      { text: "Teacher Hub", href: "https://teachers.thenational.academy" },
      { text: "Plan a lesson", href: "/lesson-planning" },
      { text: "Develop your curriculum", href: "/develop-your-curriculum" },
      { text: "Support your team", href: "/support-your-team" },
    ],
  },
  {
    title: "Oak",
    links: [
      { text: "Home", href: "/" },
      { text: "About Oak", href: "/about-us/who-we-are" },
      { text: "Careers", href: "about-us/work-with-us" },
      { text: "Contact us", href: "/contact-us" },
      { text: "Help", href: "https://support.thenational.academy/" },
      { text: "Webinars", href: "/webinars" },
      { text: "Blog", href: "/blog" },
    ],
  },

  {
    title: "Legal",
    links: [
      { text: "Privacy policy", href: "/legal/privacy-policy" },
      { text: "Cookie policy", href: "/legal/cookie-policy" },
      { text: "Copyright notice", href: "/legal/copyright-notice" },
      { text: "Terms & conditions", href: "/legal/terms-and-conditions" },
      { text: "Accessibilty statement", href: "/legal/accessibilty-statement" },
      { text: "Safeguarding statement", href: "/legal/safeguarding-statement" },
      {
        text: "Physical activity disclaimer",
        href: "/legal/physical-activity-disclaimer",
      },
      { text: "Complaints", href: "legal/complaints" },
      {
        text: "Freedom of information requests",
        href: "legal/freedom-of-information-requests",
      },
    ],
  },
];

export default footerSections;
