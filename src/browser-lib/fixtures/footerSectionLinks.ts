export type FooterLink = {
  text: string;
  href: string;
};

export type FooterSection = {
  title?: string;
  links?: FooterLink[];
};

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
      { text: "Curriculum", href: "/curriculum" },
      { text: "Lesson Planning", href: "/lesson-planning" },
      { text: "Oak For Schools", href: "/oak-for-schools" },
      { text: "Grow With Oak", href: "/grow-with-oak" },
    ],
  },
  {
    title: "Oak",
    links: [
      { text: "Home", href: "/" },
      { text: "About Oak", href: "/about-us/who-we-are" },
      { text: "Careers", href: "/careers" },
      { text: "Contact us", href: "/contact-us" },
      { text: "Help", href: "/help" },
      { text: "Webinars", href: "/webinars" },
      { text: "Blog", href: "/blog" },
    ],
  },

  {
    title: "Legal",
    links: [
      { text: "Privacy Policy", href: "/legal/privacy-policy" },
      { text: "Cookie Policy", href: "legal/cookie-policy" },
      { text: "Change Cookie Setting", href: "legal/change-cookie-setting" },
      { text: "Copyright Notice", href: "legal/copyright-notice" },
      { text: "Terms & Conditions", href: "legal/terms-and-conditions" },
      { text: "Accessibilty Statement", href: "legal/accessibilty-statement" },
      { text: "Safeguarding Statement", href: "legal/safegarding-statement" },
      {
        text: "Physical Activity Disclaimer",
        href: "legal/physical-activity-disclaimer",
      },
      { text: "Complaints", href: "legal/compaints" },
      { text: "FOIRs", href: "legal/foirs" },
    ],
  },
];

export default footerSections;
