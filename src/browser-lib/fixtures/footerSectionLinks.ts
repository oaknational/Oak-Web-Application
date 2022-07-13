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
      { text: "About us", href: "/about-us" },
      { text: "Careers", href: "/careers" },
      { text: "Contact us", href: "/contact-us" },
      { text: "Help", href: "/help" },
    ],
  },
  {
    title: "Teachers",
    links: [
      { text: "Teacher Hub", href: "https://teachers.thenational.academy" },
      { text: "Plan a lesson", href: "/plan-a-lesson" },
      { text: "Improve the curriculum", href: "/improve-curriculum" },
      { text: "Oak for school leaders", href: "/school-leaders" },
      { text: "CPD", href: "/cpd" },
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
      { text: "Private Policy", href: "/privacy-policy" },
      { text: "Cookie Policy", href: "/cookie-policy" },
      { text: "Change Cookie Setting", href: "/change-cookie-setting" },
      { text: "Copyright Notice", href: "/copyright-notice" },
      { text: "Terms & Conditions", href: "/terms-conditions" },
      { text: "Accessibilty Statement", href: "/accessibilty" },
      { text: "Safegarding Statement", href: "/safegarding" },
      { text: "Physical Activity Disclaimer", href: "/physical-activity" },
    ],
  },
];

export default footerSections;
