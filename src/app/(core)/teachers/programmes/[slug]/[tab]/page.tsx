import { notFound, redirect, RedirectType } from "next/navigation";
import { Metadata } from "next";
import { cache } from "react";
import { draftMode } from "next/headers";

import { ProgrammeView } from "./Components/ProgrammeView";
import { isTabSlug } from "./tabSchema";
import { getMetaTitle } from "./getMetaTitle";
import {
  getSubjectPhaseOptions,
  getProgrammeData,
  getSubjectOverride,
} from "./getProgrammeData";

import {
  createDownloadsData,
  CurriculumUnitsTrackingData,
  formatCurriculumUnitsData,
} from "@/pages-helpers/curriculum/docx/tab-helpers";
import { getOpenGraphMetadata, getTwitterMetadata } from "@/app/metadata";
import getBrowserConfig from "@/browser-lib/getBrowserConfig";
import OakError from "@/errors/OakError";
import {
  isValidSubjectPhaseSlug,
  getKs4RedirectSlug,
} from "@/utils/curriculum/slugs";
import errorReporter from "@/common-lib/error-reporter";
import withPageErrorHandling, {
  AppPageProps,
} from "@/hocs/withPageErrorHandling";
import { resolveOakHref } from "@/common-lib/urls";
import { getSubjectPhaseSlug } from "@/components/TeacherComponents/helpers/getSubjectPhaseSlug";
import { resolveFilterFromSearchParams } from "@/utils/curriculum/filtering";
import { redirectProgrammeSlugIfNeeded } from "@/utils/integratedJourney/legacyProgrammeUnitsRedirect";
import { cacheData } from "@/node-lib/cache";
import CMSClient from "@/node-lib/cms";
import { getMvRefreshTime } from "@/pages-helpers/curriculum/downloads/getMvRefreshTime";
import { validateServerSearchParams } from "@/utils/validateProgrammePageSearchParams";

const reportError = errorReporter("programme-page::app");

type ProgrammePageParams = { slug: string; tab: string };
export type PageSearchParms = { [key: string]: string | string[] | undefined };

const getCachedSubjectOptionData = cache(async (subjectPhaseSlug: string) =>
  getSubjectPhaseOptions(subjectPhaseSlug),
);

export type ProgrammeCmsParams = {
  subjectPhaseSlug: string;
  nonCurriculum: boolean;
  subjectTitle: string;
  phaseSlug: string;
  programmePageSlug: string;
  isPreviewModeEnabled: boolean;
};

const getCachedProgrammeCms = cache(
  cacheData(
    async ({
      nonCurriculum,
      subjectTitle,
      phaseSlug,
      programmePageSlug,
      isPreviewModeEnabled,
    }: ProgrammeCmsParams) => {
      const [curriculumCMSInfo, subjectPhaseSanityData, mvRefreshTime] =
        await Promise.all([
          nonCurriculum
            ? null
            : CMSClient.curriculumOverviewPage({
                previewMode: isPreviewModeEnabled,
                subjectTitle,
                phaseSlug,
              }),
          CMSClient.programmePageBySlug(programmePageSlug, {
            previewMode: isPreviewModeEnabled,
          }),
          getMvRefreshTime(),
        ]);

      return {
        curriculumCMSInfo,
        subjectPhaseSanityData,
        mvRefreshTime,
      };
    },
    ["programme-cms"],
  ),
);

export async function generateMetadata({
  params,
  searchParams,
}: {
  params: Promise<ProgrammePageParams>;
  searchParams: Promise<PageSearchParms>;
}): Promise<Metadata> {
  const { slug, tab } = await params;
  const originalSearchParams = await searchParams;
  const pageSearchParams = validateServerSearchParams(originalSearchParams);

  redirectProgrammeSlugIfNeeded(slug, originalSearchParams);

  try {
    const cachedSubjectData = await getCachedSubjectOptionData(slug);
    if (!cachedSubjectData) {
      return {};
    }

    const canonicalURL = new URL(
      resolveOakHref({
        page: "teacher-programme",
        subjectPhaseSlug: slug,
        tab: "units",
        query: pageSearchParams,
      }),
      getBrowserConfig("seoAppUrl"),
    ).toString();

    const { title, description } = getMetaTitle(
      cachedSubjectData,
      pageSearchParams,
    );

    return {
      title,
      description,
      alternates: {
        canonical: canonicalURL,
      },
      ...(tab === "download" && {
        robots: {
          index: false,
          follow: true,
        },
      }),
      openGraph: getOpenGraphMetadata({
        title,
        description,
      }),
      twitter: getTwitterMetadata({
        title,
        description,
      }),
    };
  } catch (error) {
    reportError(error);
    // Return and fallback to layout metadata
    return {};
  }
}

const InnerProgrammePage = async (props: AppPageProps<ProgrammePageParams>) => {
  const originalSearchParams = await props.searchParams!;
  const searchParams = validateServerSearchParams(originalSearchParams);
  const { slug: subjectPhaseSlug, tab } = await props.params;

  redirectProgrammeSlugIfNeeded(subjectPhaseSlug, searchParams ?? {});

  if (!isTabSlug(tab)) {
    return redirect("units");
  }

  const cachedSubjectData = await getCachedSubjectOptionData(subjectPhaseSlug);

  if (!cachedSubjectData) {
    return notFound();
  }

  const { subjects, subjectPhaseKeystageSlugs } = cachedSubjectData;

  const isSlugValid = isValidSubjectPhaseSlug(
    subjects,
    subjectPhaseKeystageSlugs,
  );

  if (!isSlugValid) {
    const redirectParams = getKs4RedirectSlug(
      subjects,
      subjectPhaseKeystageSlugs,
    );
    if (redirectParams) {
      const { subjectSlug, phaseSlug, ks4OptionSlug } = redirectParams;

      const programmePageHref = resolveOakHref({
        page: "teacher-programme",
        subjectPhaseSlug: getSubjectPhaseSlug({
          subject: subjectSlug,
          phaseSlug,
          examBoardSlug: ks4OptionSlug,
        }),
        tab,
        query: searchParams,
      });

      return redirect(programmePageHref, RedirectType.replace);
    } else {
      throw new OakError({
        code: "curriculum-api/not-found",
      });
    }
  }

  const cachedProgrammeData = await getProgrammeData(
    subjectPhaseSlug,
    subjects,
  );

  if (!cachedProgrammeData) {
    return notFound();
  }

  const { programmeUnitsData, curriculumUnitsData, ks4OptionFilterDimensions } =
    cachedProgrammeData;

  const curriculumPhaseOptions = {
    subjects,
    tab: "units" as const,
  };

  const { isEnabled } = await draftMode();
  const { curriculumCMSInfo, subjectPhaseSanityData, mvRefreshTime } =
    await getCachedProgrammeCms({
      subjectPhaseSlug,
      nonCurriculum: programmeUnitsData.nonCurriculum,
      subjectTitle: programmeUnitsData.subjectTitle,
      phaseSlug: subjectPhaseKeystageSlugs.phaseSlug,
      programmePageSlug: `${subjectPhaseKeystageSlugs.subjectSlug}-${subjectPhaseKeystageSlugs.phaseSlug}`,
      isPreviewModeEnabled: isEnabled,
    });

  if (!curriculumCMSInfo && !programmeUnitsData.nonCurriculum) {
    return notFound();
  }

  if (!subjectPhaseSanityData) {
    reportError(
      new OakError({
        code: "cms/missing-programme-page-data",
        meta: { subjectPhaseSlug },
      }),
    );
  }

  const curriculumUnitsFormattedData =
    formatCurriculumUnitsData(curriculumUnitsData);

  // Resolve filter server-side from URL search params
  const resolvedFilter = resolveFilterFromSearchParams(
    curriculumUnitsFormattedData,
    searchParams,
  );

  // All KS4 options for subject phase
  const ks4Options =
    curriculumPhaseOptions.subjects.find(
      (s) => s.slug === subjectPhaseKeystageSlugs.subjectSlug,
    )!.ks4_options ?? [];

  // Find examboard title from subject phases
  const ks4Option = curriculumPhaseOptions.subjects
    .flatMap((subject) => subject.ks4_options)
    .find((ks4opt) => ks4opt?.slug === subjectPhaseKeystageSlugs.ks4OptionSlug);

  const curriculumDownloadsTabData = createDownloadsData(
    curriculumUnitsData.units,
  );

  const curriculumSelectionTitles = {
    subjectTitle:
      getSubjectOverride(curriculumUnitsData.units, resolvedFilter) ??
      programmeUnitsData.subjectTitle,
    phaseTitle: programmeUnitsData.phaseTitle,
    examboardTitle: ks4Option?.title,
  };

  // TD: [integrated journey] tracking
  const curriculumUnitsTrackingData: CurriculumUnitsTrackingData = {
    ...subjectPhaseKeystageSlugs,
    subjectTitle: curriculumSelectionTitles.subjectTitle,
    ks4OptionTitle: curriculumSelectionTitles.examboardTitle,
  };

  const results = {
    subjectPhaseSlug,
    curriculumSelectionSlugs: subjectPhaseKeystageSlugs,
    curriculumSelectionTitles,
    curriculumUnitsFormattedData,
    subjectPhaseSanityData,
    tabSlug: tab,
    curriculumCMSInfo,
    ks4Options,
    ks4OptionFilterDimensions,
    trackingData: curriculumUnitsTrackingData,
    curriculumInfo: cachedProgrammeData.programmeUnitsData,
    curriculumDownloadsTabData,
    mvRefreshTime,
    initialFilter: resolvedFilter,
  };

  return <ProgrammeView {...results} />;
};

const ProgrammePage = withPageErrorHandling(
  InnerProgrammePage,
  "programme-page::app",
);

export default ProgrammePage;
