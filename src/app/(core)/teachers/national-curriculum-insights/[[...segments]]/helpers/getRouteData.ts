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
import { cmsWithCache } from "@/node-lib/cache";
import getServerConfig from "@/node-lib/getServerConfig";

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

const cacheScope = [
  "national-curriculum-insights",
  getServerConfig("sanityProjectId"),
  getServerConfig("sanityDataset"),
].join(":");
const cacheTags = ["national-curriculum-insights", cacheScope];

async function getPublishedHub() {
  return cmsWithCache({
    queryKey: "nationalCurriculumInsightsHub",
    args: [{ previewMode: false }],
    tags: cacheTags,
  });
}

async function getPublishedGuidancePage() {
  return cmsWithCache({
    queryKey: "nationalCurriculumInsightsGuidancePage",
    args: [{ previewMode: false }],
    tags: cacheTags,
  });
}

async function getPublishedSubject(slug: string) {
  return cmsWithCache({
    queryKey: "nationalCurriculumInsightsSubjectBySlug",
    args: [slug, { previewMode: false }],
    tags: cacheTags,
  });
}

// Draft reads are deduplicated within a render, but never cached across requests.
const getHub = cache((previewMode: boolean) =>
  previewMode
    ? CMSClient.nationalCurriculumInsightsHub({ previewMode: true })
    : getPublishedHub(),
);
const getGuidancePage = cache((previewMode: boolean) =>
  previewMode
    ? CMSClient.nationalCurriculumInsightsGuidancePage({ previewMode: true })
    : getPublishedGuidancePage(),
);
const getSubject = cache((slug: string, previewMode: boolean) =>
  previewMode
    ? CMSClient.nationalCurriculumInsightsSubjectBySlug(slug, {
        previewMode: true,
      })
    : getPublishedSubject(slug),
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
