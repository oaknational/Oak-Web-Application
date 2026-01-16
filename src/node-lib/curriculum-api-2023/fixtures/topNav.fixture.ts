import { TopNavProps } from "@/components/AppComponents/TopNav/TopNav";
import { OakLinkPropsSimple } from "@/common-lib/urls";

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
        slug: "about-us/who-we-are" as OakLinkPropsSimple["page"],
        title: "Who we are",
      },
      {
        slug: "about-us/our-mission" as OakLinkPropsSimple["page"],
        title: "Our mission",
      },
    ],
    guidance: [
      {
        slug: "guidance/teaching-tips" as OakLinkPropsSimple["page"],
        title: "Teaching tips",
      },
      {
        slug: "guidance/safeguarding" as OakLinkPropsSimple["page"],
        title: "Safeguarding",
      },
    ],
  },
  pupils: {
    primary: { phaseSlug: "primary", phaseTitle: "Primary", years: [] },
    secondary: { phaseSlug: "secondary", phaseTitle: "Secondary", years: [] },
  },
};
