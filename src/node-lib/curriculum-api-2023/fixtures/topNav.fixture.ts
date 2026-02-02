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
          description: "Key stage 1",
          subjects: [
            {
              title: "English",
              subjectSlug: "english",
              programmeSlug: "english-primary-ks1",
              nonCurriculum: false,
              programmeCount: 0,
            },
            {
              title: "Maths",
              subjectSlug: "maths",
              programmeSlug: "maths-primary-ks1",
              nonCurriculum: false,
              programmeCount: 0,
            },
            {
              title: "Financial education",
              subjectSlug: "financial-education",
              programmeSlug: "financial-education-primary-ks1",
              nonCurriculum: true,
              programmeCount: 0,
            },
          ],
        },
        {
          slug: "ks2",
          title: "KS2",
          description: "Key stage 2",
          subjects: [
            {
              title: "Science",
              subjectSlug: "science",
              programmeSlug: "science-primary-ks2",
              nonCurriculum: false,
              programmeCount: 0,
            },
          ],
        },
        {
          slug: "eyfs",
          title: "EYFS",
          description: "Early years foundation stage",
          subjects: [],
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
          description: "Key stage 3",
          subjects: [
            {
              title: "History",
              subjectSlug: "history",
              programmeSlug: "history-secondary-ks3",
              nonCurriculum: false,
              programmeCount: 0,
            },
          ],
        },
        {
          slug: "ks4",
          title: "KS4",
          description: "Key stage 4",
          subjects: [
            {
              title: "Geography",
              subjectSlug: "geography",
              programmeSlug: "geography-secondary-ks4",
              nonCurriculum: false,
              programmeCount: 0,
            },
          ],
        },
      ],
    },
    aboutUs: [
      {
        slug: "about-who-we-are",
        title: "Who we are",
      },
      { slug: "about-board", title: "Board" },
    ],
    guidance: [
      {
        slug: "lesson-planning",
        title: "Plan a lesson",
      },
      {
        slug: "blog-index",
        title: "Blogs",
      },
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
