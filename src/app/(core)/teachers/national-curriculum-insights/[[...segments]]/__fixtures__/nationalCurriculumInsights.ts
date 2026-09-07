import type { NationalCurriculumInsightsReader } from "../getNationalCurriculumInsightsData";

import {
  nationalCurriculumInsightsGuidancePageSchema,
  type NationalCurriculumInsightsHub,
  type NationalCurriculumInsightsKeyStage,
  type NationalCurriculumInsightsModule,
  type NationalCurriculumInsightsPage,
  type NationalCurriculumInsightsPhase,
  type NationalCurriculumInsightsSubject,
  type NationalCurriculumInsightsTabKind,
  nationalCurriculumInsightsKeyStageSlug,
} from "@/common-lib/cms-types/nationalCurriculumInsights";
type SubjectSummary = NationalCurriculumInsightsHub["subjects"][number];

const portableText = (key: string, text: string) => [
  {
    _key: `${key}-block`,
    _type: "block",
    children: [
      {
        _key: `${key}-span`,
        _type: "span",
        marks: [],
        text,
      },
    ],
    markDefs: [],
    style: "normal",
  },
];

const localImage = {
  altText: null,
  asset: null,
  hotspot: null,
  isPresentational: true,
};

const pageHeading = (
  pageType:
    | NationalCurriculumInsightsTabKind
    | NationalCurriculumInsightsKeyStage,
  subjectTitle: string,
) => {
  if (pageType === "overview") {
    return `${subjectTitle} national curriculum insights`;
  }
  if (pageType.startsWith("KS")) {
    return `${subjectTitle} key stage ${pageType.slice(2)} curriculum insights`;
  }

  const phase = pageType === "primary" ? "Primary" : "Secondary";
  return `${phase} ${subjectTitle.toLowerCase()} curriculum insights`;
};

const pageModules = (
  pageType:
    | NationalCurriculumInsightsTabKind
    | NationalCurriculumInsightsKeyStage,
  subjectTitle: string,
): NationalCurriculumInsightsModule[] => [
  {
    __typename: "NationalCurriculumInsightsHeroSection",
    heading: pageHeading(pageType, subjectTitle),
    bodyPortableText: portableText(
      `${subjectTitle}-${pageType}-hero`,
      `Explore the proposed curriculum changes and what they mean for ${subjectTitle.toLowerCase()} teaching.`,
    ),
    image: localImage,
  },
  {
    __typename: "NationalCurriculumInsightsRichTextSection",
    heading: "What this page covers",
    headingStyle: "section",
    contentPortableText: portableText(
      `${subjectTitle}-${pageType}-body`,
      `This is independently editable ${pageType} content for ${subjectTitle}.`,
    ),
  },
];

const createPage = ({
  pageType,
  subjectSlug,
  subjectTitle,
}: {
  pageType: NationalCurriculumInsightsPhase;
  subjectSlug: string;
  subjectTitle: string;
}): NationalCurriculumInsightsPage => ({
  id: `nationalCurriculumInsightsPage-${subjectSlug}-${pageType}`,
  pageType,
  title: `${subjectTitle} ${pageType} page`,
  summary: `Independent ${pageType} content for ${subjectTitle}.`,
  modules: pageModules(pageType, subjectTitle),
  keyStages: (
    [
      ...(pageType === "primary" ? (["KS1", "KS2"] as const) : []),
      ...(pageType === "secondary" ? (["KS3", "KS4"] as const) : []),
    ] as NationalCurriculumInsightsKeyStage[]
  ).map((keyStage) => ({
    keyStage,
    label: `Key stage ${keyStage.slice(2)}`,
    page: {
      id: `nationalCurriculumInsightsKeyStagePage-${subjectSlug}-${pageType}-${nationalCurriculumInsightsKeyStageSlug(keyStage)}`,
      pageType: "keyStage",
      keyStage,
      title: `${subjectTitle} key stage ${keyStage.slice(2)} page`,
      summary: `Independent ${keyStage} content for ${subjectTitle}.`,
      modules: pageModules(keyStage, subjectTitle),
    },
  })),
});

const createSubject = ({
  curriculumSubjectSlugs,
  phases,
  slug,
  title,
}: {
  curriculumSubjectSlugs: string[];
  phases: Array<"primary" | "secondary">;
  slug: string;
  title: string;
}): NationalCurriculumInsightsSubject => {
  return {
    id: `nationalCurriculumInsightsSubject-${slug}`,
    pageType: "overview",
    title,
    summary: `Independent overview content for ${title}.`,
    illustration: null,
    modules: pageModules("overview", title),
    slug,
    curriculumSubjectSlugs,
    tabs: [
      ...phases.map((phase) => ({
        kind: phase,
        label: phase === "primary" ? "Primary" : "Secondary",
        page: createPage({
          pageType: phase,
          subjectSlug: slug,
          subjectTitle: title,
        }),
      })),
    ],
  };
};

const science = createSubject({
  title: "Science",
  slug: "science",
  curriculumSubjectSlugs: ["biology", "chemistry", "physics"],
  phases: ["primary", "secondary"],
});
const english = createSubject({
  title: "English",
  slug: "english",
  curriculumSubjectSlugs: ["english"],
  phases: ["primary"],
});
const maths = createSubject({
  title: "Mathematics",
  slug: "maths",
  curriculumSubjectSlugs: ["maths"],
  phases: ["secondary"],
});
const history = createSubject({
  title: "History",
  slug: "history",
  curriculumSubjectSlugs: ["history"],
  phases: ["primary", "secondary"],
});

const subjectSummary = (
  subject: NationalCurriculumInsightsSubject,
): SubjectSummary => ({
  id: subject.id,
  title: subject.title,
  slug: subject.slug,
  illustration: subject.illustration,
  curriculumSubjectSlugs: subject.curriculumSubjectSlugs,
  tabs: subject.tabs.map(({ kind, label, page }) => ({
    kind,
    label,
    page: { id: page.id, pageType: page.pageType, title: page.title },
  })),
});

const localSubjects = [science, english, maths, history];

const localHub: NationalCurriculumInsightsHub = {
  id: "nationalCurriculumInsightsHub",
  title: "National curriculum insights",
  summary: "Explore curriculum changes by subject and phase.",
  subjects: localSubjects.map(subjectSummary),
  modules: [
    {
      __typename: "NationalCurriculumInsightsHeroSection",
      heading: "National curriculum insights",
      bodyPortableText: portableText(
        "hub-hero",
        "Explore curriculum changes by subject and phase.",
      ),
      image: localImage,
    },
    {
      __typename: "NationalCurriculumInsightsSubjectNavigationSection",
      phases: ["primary", "secondary"],
      primaryHeading: "Explore Primary curriculum changes",
      secondaryHeading: "Explore Secondary curriculum changes",
    },
  ],
};

const localGuidancePage = nationalCurriculumInsightsGuidancePageSchema.parse({
  id: "nationalCurriculumInsightsGuidancePage",
  pageType: "guidance",
  title: "Practical guidance for curriculum change",
  summary:
    "Expert analysis and practical guidance for preparing for the refreshed national curriculum.",
  modules: [
    {
      __typename: "NationalCurriculumInsightsHeroSection",
      heading: "Practical guidance for curriculum change",
      bodyPortableText: portableText(
        "guidance-hero",
        "Get subject insight, expert analysis and practical guidance to help you prepare for the refreshed national curriculum.",
      ),
      image: localImage,
    },
    {
      __typename: "NationalCurriculumInsightsGuidanceIntroSection",
      heading: "Here, you’ll find:",
      image: localImage,
      bodyPortableText: portableText(
        "guidance-introduction",
        "Practical leadership guidance in our Curriculum Conversations roundtables, alongside subject-by-subject guidance to the proposed national curriculum changes.",
      ),
      statusLabel: "Coming soon",
    },
  ],
});

const localNationalCurriculumInsightsReader: NationalCurriculumInsightsReader =
  {
    nationalCurriculumInsightsHub: async () => localHub,
    nationalCurriculumInsightsGuidancePage: async () => localGuidancePage,
    nationalCurriculumInsightsSubjectBySlug: async (
      subjectSlug,
      { previewMode } = {},
    ) => {
      const subject = localSubjects.find(({ slug }) => slug === subjectSlug);
      if (!subject) {
        return null;
      }

      if (!previewMode || subjectSlug !== "science") {
        return subject;
      }

      return {
        ...subject,
        tabs: subject.tabs.map((tab) =>
          tab.kind === "primary"
            ? {
                ...tab,
                page: {
                  ...tab.page,
                  id: `drafts.${tab.page.id}`,
                  title: "Draft Science primary page",
                  summary: "Draft content available only in preview mode.",
                },
              }
            : tab,
        ),
      };
    },
  };

export const localNationalCurriculumInsightsFixtures = {
  hub: localHub,
  reader: localNationalCurriculumInsightsReader,
  subjects: localSubjects,
};
