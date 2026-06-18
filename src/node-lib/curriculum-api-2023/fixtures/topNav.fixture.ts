import { TopNavProps } from "@/components/AppComponents/TopNav/TopNav";

export const topNavFixture: TopNavProps = {
  teachers: {
    primary: {
      slug: "primary",
      title: "Primary",
      children: [
        {
          type: "keystage",
          slug: "ks1",
          title: "KS1",
          description: "Key stage 1",
          children: [
            {
              title: "English",
              slug: "english",
              programmeSlug: "english-primary-ks1",
              href: "/teachers/programmes/english-primary/units?keystages=ks1",
              nonCurriculum: false,
              programmeCount: 0,
            },
            {
              title: "Maths",
              slug: "maths",
              programmeSlug: "maths-primary-ks1",
              href: "/teachers/programmes/maths-primary/units?keystages=ks1",
              nonCurriculum: false,
              programmeCount: 0,
            },
            {
              title: "Financial education",
              slug: "financial-education",
              programmeSlug: "financial-education-primary-ks1",
              href: "/teachers/programmes/financial-education-primary/units?keystages=ks1",
              nonCurriculum: true,
              programmeCount: 0,
            },
          ],
        },
        {
          type: "keystage",
          slug: "ks2",
          title: "KS2",
          description: "Key stage 2",
          children: [
            {
              title: "Science",
              slug: "science",
              programmeSlug: "science-primary-ks2",
              href: "/teachers/programmes/science-primary/units?keystages=ks2",
              nonCurriculum: false,
              programmeCount: 0,
            },
          ],
        },
        {
          type: "keystage",
          slug: "early-years-foundation-stage",
          title: "EYFS",
          description: "Early years foundation stage",
          children: [],
        },
      ],
    },
    secondary: {
      slug: "secondary",
      title: "Secondary",
      children: [
        {
          type: "phase",
          slug: "secondary",
          title: "All secondary",
          description: "All secondary resources",
          children: [
            {
              title: "Computer science",
              slug: "computer-science",
              programmeSlug: "computer-science-secondary",
              href: "/teachers/programmes/computer-science-secondary/units?keystages=ks3,ks4",
              nonCurriculum: false,
              programmeCount: 0,
            },
            {
              title: "Maths",
              slug: "maths",
              programmeSlug: null,
              href: "/teachers/programmes/maths-secondary/units?keystages=ks3,ks4",
              nonCurriculum: false,
              programmeCount: 0,
              examBoards: [
                {
                  buttonTitle: "Higher",
                  programmeSlug: "maths-secondary-ks4-higher",
                  href: "/teachers/programmes/maths-secondary/units?keystages=ks4&tiers=higher",
                  programmeFactors: {
                    tier: { slug: "higher", description: "Higher" },
                  },
                },
                {
                  buttonTitle: "Foundation",
                  programmeSlug: "maths-secondary-ks4-foundation",
                  href: "/teachers/programmes/maths-secondary/units?keystages=ks4&tiers=foundation",
                  programmeFactors: {
                    tier: { slug: "foundation", description: "Foundation" },
                  },
                },
              ],
            },
            {
              title: "History",
              slug: "history",
              programmeSlug: "history-secondary",
              href: "/teachers/programmes/history-secondary/units?keystages=ks3,ks4",
              nonCurriculum: false,
              programmeCount: 0,
            },
            {
              title: "Geography",
              slug: "geography",
              programmeSlug: "geography-secondary",
              href: "/teachers/programmes/geography-secondary/units?keystages=ks3,ks4",
              nonCurriculum: false,
              programmeCount: 0,
            },
          ],
        },
        {
          type: "keystage",
          slug: "ks3",
          title: "KS3",
          description: "Key stage 3",
          children: [
            {
              title: "History",
              slug: "history",
              programmeSlug: "history-secondary-ks3",
              href: "/teachers/programmes/history-secondary-edexcel/units?keystages=ks3",
              nonCurriculum: false,
              programmeCount: 0,
            },
            {
              title: "Geography",
              slug: "geography",
              programmeSlug: "geography-secondary-ks3",
              href: "/teachers/programmes/geography-secondary/units?keystages=ks3",
              nonCurriculum: false,
              programmeCount: 0,
            },
          ],
        },
        {
          type: "keystage",
          slug: "ks4",
          title: "KS4",
          description: "Key stage 4",
          children: [
            {
              title: "Geography",
              slug: "geography",
              programmeSlug: null,
              href: "/teachers/programmes/geography-secondary/units?keystages=ks4",
              nonCurriculum: false,
              programmeCount: 2,
              examBoards: [
                {
                  buttonTitle: "AQA",
                  programmeSlug: "geography-secondary-ks4-aqa",
                  href: "/teachers/programmes/geography-secondary-aqa/units?keystages=ks4&tiers=foundation",
                  programmeFactors: {
                    tier: { slug: "foundation", description: "Foundation" },
                  },
                },
                {
                  buttonTitle: "Edexcel",
                  programmeSlug: "geography-secondary-ks4-edexcel",
                  href: "/teachers/programmes/geography-secondary-edexcel/units?keystages=ks4&tiers=higher",
                  programmeFactors: {
                    tier: { slug: "higher", description: "Higher" },
                  },
                },
              ],
            },
          ],
        },
      ],
    },
    guidance: {
      slug: "guidance",
      title: "Guidance",
      children: [
        {
          slug: "lesson-planning",
          title: "Plan a lesson",
          href: "/teachers/lesson-planning",
        },
        {
          slug: "blog-index",
          title: "Blogs",
          href: "/blog",
        },
        {
          slug: "help",
          title: "Help",
          href: "https://support.thenational.academy",
          external: true,
        },
      ],
    },
    aboutUs: {
      slug: "aboutUs",
      title: "About us",
      children: [
        {
          slug: "about-who-we-are",
          title: "Who we are",
          href: "/about-us/who-we-are",
        },
        {
          slug: "about-meet-the-team",
          title: "Meet the team",
          href: "/about-us/meet-the-team",
        },
        {
          slug: "about-oaks-curricula",
          title: "Oak's curricula",
          href: "/about-us/oaks-curricula",
        },
        {
          slug: "about-get-involved",
          title: "Get involved",
          href: "/about-us/get-involved",
        },
        {
          slug: "contact",
          title: "Contact us",
          href: "/contact-us",
        },
      ],
    },
    aiExperiments: {
      slug: "labs",
      title: "Ai experiments",
      href: "https://labs.thenational.academy",
      external: true,
    },
  },
  pupils: {
    primary: {
      slug: "primary",
      title: "Primary",
      children: [
        { slug: "year-1", title: "Year 1" },
        { slug: "year-2", title: "Year 2" },
        { slug: "year-3", title: "Year 3" },
        { slug: "year-4", title: "Year 4" },
        { slug: "year-5", title: "Year 5" },
        { slug: "year-6", title: "Year 6" },
      ],
    },
    secondary: {
      slug: "secondary",
      title: "Secondary",
      children: [
        { slug: "year-7", title: "Year 7" },
        { slug: "year-8", title: "Year 8" },
        { slug: "year-9", title: "Year 9" },
        { slug: "year-10", title: "Year 10" },
        { slug: "year-11", title: "Year 11" },
      ],
    },
    help: {
      slug: "help",
      title: "Help",
      href: "https://support.thenational.academy",
      external: true,
    },
  },
};
