import { getCareersUrl, getHelpUrl } from "../../common-lib/urls";
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
    ],
  },
  oak: {
    title: "Oak",
    links: [
      { text: "Home", href: "/" },
      { text: "About us", href: "/about-us/who-we-are" },
      {
        text: "Careers",
        href: getCareersUrl(),
      },
      { text: "Contact us", href: "/contact-us" },
      { text: "Help", href: getHelpUrl() },
      { text: "Blog", href: "/blog" },
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
      { text: "Accessibilty statement", href: "/legal/accessibility-statement" },
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
