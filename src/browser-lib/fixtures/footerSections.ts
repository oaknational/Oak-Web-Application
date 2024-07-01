import { FooterSections } from "@/components/AppComponents/LayoutSiteFooter/LayoutSiteFooter";

const footerSections: FooterSections = {
  pupils: {
    title: "Pupils",
    links: [
      {
        text: "Learn online",
        type: "page",
        page: "pupil-year-index",
      },
    ],
  },
  teachers: {
    title: "Teachers",
    links: [
      {
        text: "EYFS",
        href: "/teachers/key-stages/early-years-foundation-stage/subjects",
      },
      {
        text: "Specialist",
        href: "/teachers/specialist/subjects",
      },
      {
        text: "Key stage 1",
        href: "/teachers/key-stages/ks1/subjects",
      },
      {
        text: "Key stage 2",
        href: "/teachers/key-stages/ks2/subjects",
      },
      {
        text: "Key stage 3",
        href: "/teachers/key-stages/ks3/subjects",
      },
      {
        text: "Key stage 4",
        href: "/teachers/key-stages/ks4/subjects",
      },

      {
        text: "Curriculum plans",
        type: "page",
        page: "curriculum-landing-page",
      },
      { text: "Plan a lesson", type: "page", page: "lesson-planning" },
      { text: "Support your team", type: "page", page: "support-your-team" },
    ],
  },
  oak: {
    title: "Oak",
    links: [
      { text: "Home", type: "page", page: "home" },
      { text: "About us", type: "page", page: "about-who-we-are" },
      {
        text: "Careers",
        href: "https://jobs.thenational.academy",
        icon: "external",
        ariaLabel: "Careers (opens in a new tab)",
      },
      { text: "Contact us", type: "page", page: "contact" },
      {
        text: "Help",
        type: "page",
        page: "help",
        icon: "external",
        ariaLabel: "Help (opens in a new tab)",
      },
      { text: "Blog", type: "page", page: "blog-index" },
      { text: "Webinars", type: "page", page: "webinar-index" },
      {
        text: "Status",
        href: "https://status.thenational.academy",
        icon: "external",
        ariaLabel: "Status (opens in a new tab)",
      },
    ],
  },

  legal: {
    title: "Legal",
    links: [
      { text: "Terms & conditions", href: "/legal/terms-and-conditions" },
      { text: "Privacy policy", href: "/legal/privacy-policy" },
      { text: "Cookie policy", href: "/legal/cookie-policy" },
      { text: "Manage cookie settings", type: "consent-manager-toggle" },

      { text: "Copyright notice", href: "/legal/copyright-notice" },
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
