export type FooterLink = {
  text: string;
  href: string;
};

export type FooterSection = {
  title: string;
  links: FooterLink[];
};

const footerSections: FooterSection[] = [
  {
    title: "Oak",
    links: [
      { text: "Home", href: "/" },
      { text: "About us", href: "/about-us" }, //placeholder href
      { text: "Careers", href: "/careers" }, //placeholder href
      { text: "Contact us", href: "/contact-us" }, //placeholder href
      { text: "Help", href: "/help" }, //placeholder href
    ],
  },
  {
    title: "Teachers",
    links: [
      { text: "Teacher Hub", href: "https://teachers.thenational.academy" },
      { text: "Plan a lesson", href: "/lesson-planning" },
      { text: "Improve the curriculum", href: "/improve-curriculum" }, //placeholder href
      { text: "Oak for school leaders", href: "/school-leaders" }, //placeholder href
      { text: "CPD", href: "/cpd" }, //placeholder href
    ],
  },

  {
    title: "Pupil",
    links: [
      { text: "Classroom", href: "https://classroom.thenational.academy/" },
    ],
  },
  {
    title: "Legal",
    links: [
      { text: "Private Policy", href: "/privacy-policy" }, //placeholder href
      { text: "Cookie Policy", href: "/cookie-policy" }, //placeholder href
      { text: "Change Cookie Setting", href: "/change-cookie-setting" }, //placeholder href
      { text: "Copyright Notice", href: "/copyright-notice" }, //placeholder href
      { text: "Terms & Conditions", href: "/terms-conditions" }, //placeholder href
      { text: "Accessibilty Statement", href: "/accessibilty" }, //placeholder href
      { text: "Safegarding Statement", href: "/safegarding" }, //placeholder href
      { text: "Physical Activity Disclaimer", href: "/physical-activity" }, //placeholder href
    ],
  },
];

export default footerSections;
