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
      { text: "Curriculum", href: "/improve-curriculum" }, //placeholder href
      { text: "Lesson Planning", href: "/plan-a-lesson" }, //placeholder href
      { text: "Oak For Schools", href: "/school-leaders" }, //placeholder href
      { text: "Grow With Oak", href: "/cpd" }, //placeholder href
    ],
  },
  {
    title: "Oak",
    links: [
      { text: "Home", href: "/" },
      { text: "About Oak", href: "/about-us" }, //placeholder href
      { text: "Careers", href: "/careers" }, //placeholder href
      { text: "Contact us", href: "/contact-us" }, //placeholder href
      { text: "Help", href: "/help" }, //placeholder href
      { text: "Webinar", href: "/webinar" }, //placeholder href
      { text: "Blog", href: "/blog" }, //placeholder href
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
      { text: "Complaints", href: "/compaints" }, //placeholder href
      { text: "FOIRs", href: "/foirs" }, //placeholder href
    ],
  },
];

export default footerSections;
