import { resolveOakHref } from "@/common-lib/urls";
import { FooterSections } from "@/components/AppComponents/LayoutSiteFooter/LayoutSiteFooter";

const footerSections: FooterSections = {
  pupils: {
    title: "Pupils",
    links: [
      {
        text: "Learn online",
        type: "link",
        href: resolveOakHref({ page: "pupil-year-index" }),
      },
    ],
  },
  teachers: {
    title: "Teachers",
    links: [
      {
        text: "EYFS",
        type: "link",
        href: resolveOakHref({
          page: "subject-index",
          keyStageSlug: "early-years-foundation-stage",
        }),
      },
      {
        text: "Specialist",
        type: "link",
        href: "/teachers/specialist/subjects",
      },
      {
        text: "Key stage 1",
        type: "link",
        href: resolveOakHref({ page: "subject-index", keyStageSlug: "ks1" }),
      },
      {
        text: "Key stage 2",
        type: "link",
        href: resolveOakHref({ page: "subject-index", keyStageSlug: "ks2" }),
      },
      {
        text: "Key stage 3",
        type: "link",
        href: resolveOakHref({ page: "subject-index", keyStageSlug: "ks3" }),
      },
      {
        text: "Key stage 4",
        type: "link",
        href: resolveOakHref({ page: "subject-index", keyStageSlug: "ks4" }),
      },

      {
        text: "Curriculum plans",
        type: "link",
        href: resolveOakHref({ page: "curriculum-landing-page" }),
      },
      {
        text: "Plan a lesson",
        type: "link",
        href: resolveOakHref({ page: "lesson-planning" }),
      },
      {
        text: "Support your team",
        type: "link",
        href: resolveOakHref({ page: "support-your-team" }),
      },
    ],
  },
  oak: {
    title: "Oak",
    links: [
      { text: "Home", type: "link", href: resolveOakHref({ page: "home" }) },
      {
        text: "About us",
        type: "link",
        href: resolveOakHref({ page: "about-who-we-are" }),
      },
      {
        text: "Careers",
        type: "link",
        href: "https://jobs.thenational.academy",
        icon: "external",
        ariaLabel: "Careers (opens in a new tab)",
      },
      {
        text: "Contact us",
        type: "link",
        href: resolveOakHref({ page: "contact" }),
      },
      {
        text: "Help",
        type: "link",
        href: resolveOakHref({ page: "help" }),
        icon: "external",
        ariaLabel: "Help (opens in a new tab)",
      },
      {
        text: "Blog",
        type: "link",
        href: resolveOakHref({ page: "blog-index" }),
      },
      {
        text: "Webinars",
        type: "link",
        href: resolveOakHref({ page: "webinar-index" }),
      },
      {
        text: "Status",
        href: "https://status.thenational.academy",
        icon: "external",
        type: "link",
        ariaLabel: "Status (opens in a new tab)",
      },
    ],
  },

  legal: {
    title: "Legal",
    links: [
      {
        text: "Terms & conditions",
        type: "link",
        href: "/legal/terms-and-conditions",
      },
      { text: "Privacy policy", type: "link", href: "/legal/privacy-policy" },
      { text: "Cookie policy", type: "link", href: "/legal/cookie-policy" },
      { text: "Manage cookie settings", type: "consent-manager-toggle" },

      {
        text: "Copyright notice",
        type: "link",
        href: "/legal/copyright-notice",
      },
      {
        text: "Accessibility statement",
        type: "link",
        href: "/legal/accessibility-statement",
      },
      {
        text: "Safeguarding statement",
        type: "link",
        href: "/legal/safeguarding-statement",
      },
      {
        text: "Physical activity disclaimer",
        type: "link",
        href: "/legal/physical-activity-disclaimer",
      },
      { text: "Complaints", type: "link", href: "/legal/complaints" },
      {
        text: "Freedom of information requests",
        type: "link",
        href: "/legal/freedom-of-information-requests",
      },
    ],
  },
};

export default footerSections;
