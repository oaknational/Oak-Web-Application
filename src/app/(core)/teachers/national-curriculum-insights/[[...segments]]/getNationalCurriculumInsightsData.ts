import {
  type NationalCurriculumInsightsHub,
  type NationalCurriculumInsightsGuidancePage,
  type NationalCurriculumInsightsKeyStage,
  type NationalCurriculumInsightsKeyStagePage,
  type NationalCurriculumInsightsPage,
  type NationalCurriculumInsightsSubject,
  type NationalCurriculumInsightsTabKind,
  nationalCurriculumInsightsKeyStageFromSlug,
} from "@/common-lib/cms-types/nationalCurriculumInsights";
import type { NationalCurriculumInsightsRoute } from "@/common-lib/urls/nationalCurriculumInsights";
import CMSClient from "@/node-lib/cms";

export type NationalCurriculumInsightsReader = Pick<
  typeof CMSClient,
  | "nationalCurriculumInsightsHub"
  | "nationalCurriculumInsightsGuidancePage"
  | "nationalCurriculumInsightsSubjectBySlug"
>;

type SubjectSummary = NationalCurriculumInsightsHub["subjects"][number];

export type NationalCurriculumInsightsRouteData = {
  hub: NationalCurriculumInsightsHub;
  route: NationalCurriculumInsightsRoute;
  subjects: SubjectSummary[];
  subject: NationalCurriculumInsightsSubject | null;
  page:
    | NationalCurriculumInsightsSubject
    | NationalCurriculumInsightsGuidancePage
    | NationalCurriculumInsightsPage
    | NationalCurriculumInsightsKeyStagePage
    | null;
  activeTab: NationalCurriculumInsightsTabKind | null;
  activeKeyStage: NationalCurriculumInsightsKeyStage | null;
};

// Load local preview content only after the explicit runtime guards below pass.
const localPreviewReader: NationalCurriculumInsightsReader = {
  nationalCurriculumInsightsHub: async (...args) =>
    (
      await import("./__fixtures__/previewReader")
    ).localPreviewSnapshotReader.nationalCurriculumInsightsHub(...args),
  nationalCurriculumInsightsGuidancePage: async (...args) =>
    (
      await import("./__fixtures__/previewReader")
    ).localPreviewSnapshotReader.nationalCurriculumInsightsGuidancePage(
      ...args,
    ),
  nationalCurriculumInsightsSubjectBySlug: async (...args) =>
    (
      await import("./__fixtures__/previewReader")
    ).localPreviewSnapshotReader.nationalCurriculumInsightsSubjectBySlug(
      ...args,
    ),
};

export const getNationalCurriculumInsightsReader =
  (): NationalCurriculumInsightsReader => {
    const localPreviewRequested =
      process.env.NATIONAL_CURRICULUM_INSIGHTS_LOCAL_FIXTURES === "true";
    const isLocalPreviewRuntime =
      process.env.NATIONAL_CURRICULUM_INSIGHTS_LOCAL_PREVIEW_RUNTIME === "true";

    if (!localPreviewRequested) {
      return CMSClient;
    }

    if (process.env.NODE_ENV !== "development" && !isLocalPreviewRuntime) {
      throw new Error(
        "National Curriculum Insights preview content is only available in development or the dedicated local preview runtime",
      );
    }

    return localPreviewReader;
  };

export const getNationalCurriculumInsightsRouteData = async (
  route: NationalCurriculumInsightsRoute,
  {
    previewMode,
    reader = getNationalCurriculumInsightsReader(),
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

  if (route.kind === "guidance") {
    const page = await reader.nationalCurriculumInsightsGuidancePage({
      previewMode,
    });
    if (!page) {
      return null;
    }

    return {
      hub,
      route,
      subjects: hub.subjects,
      subject: null,
      page,
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
    subject?.id.replace(/^drafts\./, "") !==
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
  let page;
  if (activeTab === "overview") {
    page = subject;
  } else if (activeKeyStage) {
    page = phasePage?.keyStages.find(
      ({ keyStage }) => keyStage === activeKeyStage,
    )?.page;
  } else {
    page = phasePage;
  }
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
