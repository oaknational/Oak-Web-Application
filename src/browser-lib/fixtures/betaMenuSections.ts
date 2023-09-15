import { BetaMenuSections } from "@/components/NewMenuSections/types";

export const betaMenuSections: BetaMenuSections = [
  {
    header: "Teachers",
    links: [
      {
        linkTo: { page: "home", viewType: "teachers-2023" },
        text: "Home",
        new: false,
        external: false,
      },
      {
        linkTo: { page: "early-release-units", viewType: "teachers-2023" },
        text: "Early release units",
        new: true,
        external: false,
      },
      {
        linkTo: {
          page: "subject-index",
          keyStageSlug: "ks1",
          viewType: "teachers-2023",
        },
        text: "Key stage 1",
        new: false,
        external: false,
      },
      {
        linkTo: {
          page: "subject-index",
          keyStageSlug: "ks2",
          viewType: "teachers-2023",
        },
        text: "Key stage 2",
        new: false,
        external: false,
      },
      {
        linkTo: {
          page: "subject-index",
          keyStageSlug: "ks3",
          viewType: "teachers-2023",
        },
        text: "Key stage 3",
        new: false,
        external: false,
      },
      {
        linkTo: {
          page: "subject-index",
          keyStageSlug: "ks4",
          viewType: "teachers-2023",
        },
        text: "Key stage 4",
        new: false,
        external: false,
      },
      {
        linkTo: {
          href: "https://teachers.thenational.academy/key-stages/early-years-foundation-stage",
        },
        text: "EYFS",
        new: false,
        external: true,
      },
      {
        linkTo: { href: "https://teachers.thenational.academy/specialist" },
        text: "Specialist",
        new: false,
        external: true,
      },
      {
        linkTo: { page: "curriculum-landing-page", viewType: "teachers-2023" },
        text: "Curriculum plans",
        new: false,
        external: false,
      },
      {
        linkTo: { href: "https://teachers.thenational.academy/" },
        text: "Teacher Hub (old)",
        new: false,
        external: true,
      },
    ],
  },
  {
    header: "Pupils",
    links: [
      {
        linkTo: { href: "https://classroom.thenational.academy/" },
        text: "Learn online",
        new: false,
        external: true,
      },
    ],
  },
  {
    header: "Oak",
    links: [
      {
        linkTo: { page: "lesson-planning" },
        text: "Plan a lesson",
        new: false,
        external: false,
      },
      {
        linkTo: { page: "support-your-team" },
        text: "Support your team",
        new: false,
        external: false,
      },
      {
        linkTo: { page: "blog-index" },
        text: "Blogs",
        new: false,
        external: false,
      },
      {
        linkTo: { page: "webinar-index" },
        text: "Webinars",
        new: false,
        external: false,
      },
      {
        linkTo: { page: "about-who-we-are" },
        text: "About us",
        new: false,
        external: false,
      },
      {
        linkTo: { page: "contact" },
        text: "Contact us",
        new: false,
        external: false,
      },
      {
        linkTo: { href: "https://support.thenational.academy/" },
        text: "Help",
        new: false,
        external: true,
      },
    ],
  },
];
