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
          ],
        },
        {
          slug: "ks2",
          title: "KS2",
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
      { slug: "about-us/who-we-are", title: "Who we are" },
      { slug: "about-us/our-mission", title: "Our mission" },
    ],
    guidance: [
      { slug: "guidance/teaching-tips", title: "Teaching tips" },
      { slug: "guidance/safeguarding", title: "Safeguarding" },
    ],
  },
  pupils: {
    primary: { phaseSlug: "primary", phaseTitle: "Primary", years: [] },
    secondary: { phaseSlug: "secondary", phaseTitle: "Secondary", years: [] },
  },
};
