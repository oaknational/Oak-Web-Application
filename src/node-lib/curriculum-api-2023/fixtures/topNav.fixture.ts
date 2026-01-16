import { TopNavProps } from "@/components/AppComponents/TopNav/TopNav";

export const topNavFixture: TopNavProps = {
  teachers: {
    primary: {
      phaseSlug: "primary",
      phaseTitle: "Primary",
      keystages: [
        {
          slug: "ks1",
          title: "KS1",
          subjects: [
            {
              subjectSlug: "art",
              title: "Art and design",
              nonCurriculum: false,
              programmeSlug: null,
              programmeCount: 2,
            },
            {
              subjectSlug: "computing",
              title: "Computing",
              nonCurriculum: false,
              programmeSlug: "computing-primary-ks1",
              programmeCount: 1,
            },
            {
              subjectSlug: "financial-education",
              title: "Financial education",
              nonCurriculum: true,
              programmeSlug: "financial-education-primary-ks1",
              programmeCount: 1,
            },
          ],
        },
        {
          slug: "ks2",
          title: "KS2",
          subjects: [
            {
              subjectSlug: "financial-education",
              title: "Financial education",
              nonCurriculum: true,
              programmeSlug: "financial-education-primary-ks2",
              programmeCount: 1,
            },
            {
              subjectSlug: "art",
              title: "Art and design",
              nonCurriculum: false,
              programmeSlug: null,
              programmeCount: 2,
            },
            {
              subjectSlug: "computing",
              title: "Computing",
              nonCurriculum: false,
              programmeSlug: null,
              programmeCount: 2,
            },
          ],
        },
        {
          slug: "early-years-foundation-stage",
          title: "EYFS",
          subjects: [
            {
              subjectSlug: "expressive-arts-and-design",
              title: "Expressive arts and design",
              nonCurriculum: false,
              programmeSlug:
                "expressive-arts-and-design-foundation-early-years-foundation-stage-l",
              programmeCount: 1,
            },
            {
              subjectSlug: "literacy",
              title: "Literacy",
              nonCurriculum: false,
              programmeSlug:
                "literacy-foundation-early-years-foundation-stage-l",
              programmeCount: 1,
            },
          ],
        },
      ],
    },
    secondary: {
      phaseSlug: "secondary",
      phaseTitle: "Secondary",
      keystages: [
        {
          slug: "ks3",
          title: "KS3",
          subjects: [
            {
              subjectSlug: "art",
              title: "Art and design",
              nonCurriculum: false,
              programmeSlug: null,
              programmeCount: 2,
            },
            {
              subjectSlug: "financial-education",
              title: "Financial education",
              nonCurriculum: true,
              programmeSlug: "financial-education-secondary-ks3",
              programmeCount: 1,
            },
            {
              subjectSlug: "citizenship",
              title: "Citizenship",
              nonCurriculum: false,
              programmeSlug: null,
              programmeCount: 2,
            },
          ],
        },
        {
          slug: "ks4",
          title: "KS4",
          subjects: [
            {
              subjectSlug: "financial-education",
              title: "Financial education",
              nonCurriculum: true,
              programmeSlug: "financial-education-secondary-ks4",
              programmeCount: 1,
            },
            {
              subjectSlug: "physical-education",
              title: "Physical education (Core)",
              nonCurriculum: false,
              programmeSlug: "physical-education-secondary-ks4-core",
              programmeCount: 1,
            },
            {
              subjectSlug: "physical-education",
              title: "Physical education (GCSE)",
              nonCurriculum: false,
              programmeSlug: null,
              programmeCount: 3,
            },
            {
              subjectSlug: "spanish",
              title: "Spanish",
              nonCurriculum: false,
              programmeSlug: null,
              programmeCount: 3,
            },
          ],
        },
      ],
    },
    aboutUs: [
      { title: "Who we are", slug: "about-who-we-are" },
      { title: "Board", slug: "about-board" },
      { title: "Work with us", slug: "about-work-with-us" },
      { title: "Leadership", slug: "about-leadership" },
      { title: "Partners", slug: "about-partners" },
      { title: "Contact us", slug: "contact" },
    ],
    guidance: [
      { title: "Plan a lesson", slug: "lesson-planning" },
      { title: "Blogs", slug: "blog-index" },
      { title: "Help", slug: "help", external: true },
      { title: "Support your team", slug: "support-your-team" },
      { title: "Webinars", slug: "webinar-index" },
    ],
  },
  pupils: {
    primary: {
      phaseSlug: "primary",
      phaseTitle: "Primary",
      years: [
        { slug: "year-1", title: "Year 1" },
        { slug: "year-2", title: "Year 2" },
        { slug: "year-3", title: "Year 3" },
        { slug: "year-4", title: "Year 4" },
        { slug: "year-5", title: "Year 5" },
        { slug: "year-6", title: "Year 6" },
      ],
    },
    secondary: {
      phaseSlug: "secondary",
      phaseTitle: "Secondary",
      years: [
        { slug: "year-7", title: "Year 7" },
        { slug: "year-8", title: "Year 8" },
        { slug: "year-9", title: "Year 9" },
        { slug: "year-10", title: "Year 10" },
        { slug: "year-11", title: "Year 11" },
      ],
    },
  },
};
