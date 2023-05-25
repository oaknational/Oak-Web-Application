import { FooterSections } from "../../components/SiteFooter/SiteFooter";

const footerSections: FooterSections = {
  pupils: {
    title: "Pupils",
    links: [{ text: "Classroom", type: "pupils-link" }],
  },
  teachers: {
    title: "Teachers",
    links: [
      { text: "Teacher Hub", type: "teachers-link" },
      { text: "Plan a lesson", href: "/lesson-planning" },
      { text: "Develop your curriculum", href: "/develop-your-curriculum" },
      { text: "Support your team", href: "/support-your-team" },
    ],
  },
  oak: {
    title: "Oak",
    links: [
      { text: "Home", href: "/" },
      { text: "About us", href: "/about-us/who-we-are" },
      {
        text: "Careers",
        href: "https://jobs.thenational.academy",
      },
      { text: "Contact us", href: "/contact-us" },
      {
        text: "Help",
        href: "https://support.thenational.academy",
      },
      { text: "Blog", href: "/blog" },
      { text: "Webinars", href: "/webinars" },
      {
        text: "Status",
        href: "https://status.thenational.academy",
      },
    ],
  },

  legal: {
    title: "Legal",
    links: [
      { text: "Privacy policy", href: "/legal/privacy-policy" },
      { text: "Cookie policy", href: "/legal/cookie-policy" },
      { text: "Manage cookie settings", type: "consent-manager-toggle" },
      { text: "Copyright notice", href: "/legal/copyright-notice" },
      { text: "Terms & conditions", href: "/legal/terms-and-conditions" },
      {
        text: "Accessibility statement",
        href: "/legal/accessibility-statement",
      },
      { text: "Safeguarding statement", href: "/legal/safeguarding-statement" },
      {
        text: "Physical activity disclaimer",
        href: "/legal/physical-activity-disclaimer",
      },
      { text: "Complaints", href: "/legal/complaints" },
      {
        text: "Freedom of information requests",
        href: "/legal/freedom-of-information-requests",
      },
    ],
  },
};

export default footerSections;
