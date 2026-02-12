import { TopNavProps } from "@/components/AppComponents/TopNav/TopNav";

export const topNavFixture: TopNavProps = {
  teachers: {
    primary: {
      slug: "primary",
      title: "Primary",
      children: [
        {
          slug: "ks1",
          title: "KS1",
          description: "Key stage 1",
          children: [
            {
              title: "English",
              slug: "english",
              programmeSlug: "english-primary-ks1",
              nonCurriculum: false,
              programmeCount: 0,
            },
            {
              title: "Maths",
              slug: "maths",
              programmeSlug: "maths-primary-ks1",
              nonCurriculum: false,
              programmeCount: 0,
            },
            {
              title: "Financial education",
              slug: "financial-education",
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
          children: [
            {
              title: "Science",
              slug: "science",
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
          children: [],
        },
      ],
    },
    secondary: {
      slug: "secondary",
      title: "Secondary",
      children: [
        {
          slug: "ks3",
          title: "KS3",
          description: "Key stage 3",
          children: [
            {
              title: "History",
              slug: "history",
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
          children: [
            {
              title: "Geography",
              slug: "geography",
              programmeSlug: "geography-secondary-ks4",
              nonCurriculum: false,
              programmeCount: 0,
            },
          ],
        },
      ],
    },
    curriculum: {
      slug: "curriculum-landing-page",
      title: "Curriculum",
    },
    aboutUs: {
      slug: "aboutUs",
      title: "About us",
      children: [
        {
          slug: "about-who-we-are",
          title: "Who we are",
        },
        { slug: "about-board", title: "Board" },
      ],
    },
    guidance: {
      slug: "guidance",
      title: "Guidance",
      children: [
        {
          slug: "lesson-planning",
          title: "Plan a lesson",
        },
        {
          slug: "blog-index",
          title: "Blogs",
        },
        {
          slug: "help",
          title: "Help",
          external: true,
        },
      ],
    },
    aiExperiments: {
      slug: "labs",
      title: "AI experiments",
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
  },
};
