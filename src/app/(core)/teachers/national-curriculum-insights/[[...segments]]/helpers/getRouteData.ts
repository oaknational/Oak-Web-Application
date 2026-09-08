import { cache } from "react";

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
  hub: NationalCurriculumInsightsHub | null;
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

// Memoise within a server render only. Keeping primitive arguments separates
// published and draft reads without retaining content across requests.
const getHub = cache((previewMode: boolean) =>
  CMSClient.nationalCurriculumInsightsHub({ previewMode }),
);
const getGuidancePage = cache((previewMode: boolean) =>
  CMSClient.nationalCurriculumInsightsGuidancePage({ previewMode }),
);
const getSubject = cache((slug: string, previewMode: boolean) =>
  CMSClient.nationalCurriculumInsightsSubjectBySlug(slug, { previewMode }),
);

const reader: NationalCurriculumInsightsReader = {
  nationalCurriculumInsightsHub: ({ previewMode = false } = {}) =>
    getHub(previewMode),
  nationalCurriculumInsightsGuidancePage: ({ previewMode = false } = {}) =>
    getGuidancePage(previewMode),
  nationalCurriculumInsightsSubjectBySlug: (
    slug,
    { previewMode = false } = {},
  ) => getSubject(slug, previewMode),
};

export const getNationalCurriculumInsightsReader =
  (): NationalCurriculumInsightsReader => reader;

const getGuidanceRouteData = async (
  route: Extract<NationalCurriculumInsightsRoute, { kind: "guidance" }>,
  reader: NationalCurriculumInsightsReader,
  previewMode: boolean,
): Promise<NationalCurriculumInsightsRouteData | null> => {
  const page = await reader.nationalCurriculumInsightsGuidancePage({
    previewMode,
  });
  if (!page) {
    return null;
  }

  const needsCatalogue = page.modules.some(
    ({ __typename }) =>
      __typename === "NationalCurriculumInsightsSubjectNavigationSection" ||
      __typename === "NationalCurriculumInsightsDownloadSection",
  );
  const hub = needsCatalogue
    ? await reader.nationalCurriculumInsightsHub({ previewMode })
    : null;

  return {
    hub,
    route,
    subjects: hub?.subjects ?? [],
    subject: null,
    page,
    activeTab: null,
    activeKeyStage: null,
  };
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
  if (route.kind === "guidance") {
    return getGuidanceRouteData(route, reader, previewMode);
  }

  const hub = await reader.nationalCurriculumInsightsHub({ previewMode });
  if (!hub) return null;

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
