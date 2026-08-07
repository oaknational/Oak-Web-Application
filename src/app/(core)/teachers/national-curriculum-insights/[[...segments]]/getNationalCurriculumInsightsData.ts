import {
  type NationalCurriculumInsightsHub,
  type NationalCurriculumInsightsKeyStage,
  type NationalCurriculumInsightsKeyStagePage,
  type NationalCurriculumInsightsModule,
  type NationalCurriculumInsightsPage,
  type NationalCurriculumInsightsPhase,
  type NationalCurriculumInsightsSubject,
  type NationalCurriculumInsightsTabKind,
  nationalCurriculumInsightsKeyStageFromSlug,
  nationalCurriculumInsightsKeyStageSlug,
} from "@/common-lib/cms-types/nationalCurriculumInsights";
import type { NationalCurriculumInsightsRoute } from "@/common-lib/urls/nationalCurriculumInsights";
import CMSClient from "@/node-lib/cms";

export type NationalCurriculumInsightsReader = Pick<
  typeof CMSClient,
  "nationalCurriculumInsightsHub" | "nationalCurriculumInsightsSubjectBySlug"
>;

type SubjectSummary = NationalCurriculumInsightsHub["subjects"][number];

export type NationalCurriculumInsightsRouteData = {
  hub: NationalCurriculumInsightsHub;
  route: NationalCurriculumInsightsRoute;
  subjects: SubjectSummary[];
  subject: NationalCurriculumInsightsSubject | null;
  page:
    | NationalCurriculumInsightsSubject
    | NationalCurriculumInsightsPage
    | NationalCurriculumInsightsKeyStagePage
    | null;
  activeTab: NationalCurriculumInsightsTabKind | null;
  activeKeyStage: NationalCurriculumInsightsKeyStage | null;
};

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

const pageModules = (
  pageType:
    | NationalCurriculumInsightsTabKind
    | NationalCurriculumInsightsKeyStage,
  subjectTitle: string,
): NationalCurriculumInsightsModule[] => [
  {
    __typename: "NationalCurriculumInsightsHeroSection",
    heading:
      pageType === "overview"
        ? `${subjectTitle} national curriculum insights`
        : pageType.startsWith("KS")
          ? `${subjectTitle} key stage ${pageType.slice(2)} curriculum insights`
          : `${pageType === "primary" ? "Primary" : "Secondary"} ${subjectTitle.toLowerCase()} curriculum insights`,
    bodyPortableText: portableText(
      `${subjectTitle}-${pageType}-hero`,
      `Explore the proposed curriculum changes and what they mean for ${subjectTitle.toLowerCase()} teaching.`,
    ),
    image: localImage,
  },
  {
    __typename: "NationalCurriculumInsightsRichTextSection",
    heading: "What this page covers",
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

const localNationalCurriculumInsightsReader: NationalCurriculumInsightsReader =
  {
    nationalCurriculumInsightsHub: async () => localHub,
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

export const getNationalCurriculumInsightsRouteData = async (
  route: NationalCurriculumInsightsRoute,
  {
    previewMode,
    reader = CMSClient,
  }: {
    previewMode: boolean;
    reader?: NationalCurriculumInsightsReader;
  },
): Promise<NationalCurriculumInsightsRouteData | null> => {
  const hub = await reader.nationalCurriculumInsightsHub({ previewMode });
  if (!hub) {
    return null;
  }

  if (route.kind === "hub") {
    return {
      hub,
      route,
      subjects: hub.subjects,
      subject: null,
      page: null,
      activeTab: null,
      activeKeyStage: null,
    };
  }

  const catalogueSubject = hub.subjects.find(
    ({ slug }) => slug === route.subjectSlug,
  );
  if (!catalogueSubject) {
    return null;
  }

  const subject = await reader.nationalCurriculumInsightsSubjectBySlug(
    route.subjectSlug,
    { previewMode },
  );
  if (
    !subject ||
    subject.id.replace(/^drafts\./, "") !==
      catalogueSubject.id.replace(/^drafts\./, "")
  ) {
    return null;
  }

  const activeTab = route.kind === "subject" ? "overview" : route.phase;
  const phasePage =
    activeTab === "overview"
      ? null
      : subject.tabs.find(({ kind }) => kind === activeTab)?.page;
  const activeKeyStage =
    route.kind === "subjectPhaseKeyStage"
      ? nationalCurriculumInsightsKeyStageFromSlug(route.keyStageSlug)
      : null;
  const page =
    activeTab === "overview"
      ? subject
      : activeKeyStage
        ? phasePage?.keyStages.find(
            ({ keyStage }) => keyStage === activeKeyStage,
          )?.page
        : phasePage;
  if (!page) {
    return null;
  }

  return {
    hub,
    route,
    subjects: hub.subjects,
    subject,
    page,
    activeTab,
    activeKeyStage,
  };
};

export const localNationalCurriculumInsightsFixtures = {
  hub: localHub,
  reader: localNationalCurriculumInsightsReader,
  subjects: localSubjects,
};
