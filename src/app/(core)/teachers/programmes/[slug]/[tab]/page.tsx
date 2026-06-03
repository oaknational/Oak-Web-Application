import { notFound, redirect, RedirectType } from "next/navigation";
import { Metadata } from "next";
import { cache } from "react";

import { ProgrammeView } from "./Components/ProgrammeView";
import { isTabSlug } from "./tabSchema";
import { getMetaTitle } from "./getMetaTitle";
import { getProgrammeData } from "./getProgrammeData";

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
import { resolveFilterFromSearchParams } from "@/utils/curriculum/filtersUrl";
import { redirectProgrammeSlugIfNeeded } from "@/utils/integratedJourney/legacyProgrammeUnitsRedirect";
import { cacheData } from "@/node-lib/cache";
import curriculumApi2023 from "@/node-lib/curriculum-api-2023";
import CMSClient from "@/node-lib/cms";
import { getMvRefreshTime } from "@/pages-helpers/curriculum/downloads/getMvRefreshTime";
import { validateServerSearchParams } from "@/utils/validateProgrammePageSearchParams";

const reportError = errorReporter("programme-page::app");

const validateSearchParams = async (searchParams: Promise<PageSearchParms>) => {
  const params = await searchParams;
  return {
    ...params,
    ...validateServerSearchParams(params),
  };
};

type ProgrammePageParams = { slug: string; tab: string };
export type PageSearchParms = { [key: string]: string | string[] | undefined };

const getCachedProgrammeData = cache(
  cacheData(
    async (subjectPhaseSlug: string) => {
      return getProgrammeData(curriculumApi2023, subjectPhaseSlug);
    },
    ["programme-data"],
  ),
);

export type ProgrammeCmsParams = {
  subjectPhaseSlug: string;
  nonCurriculum: boolean;
  subjectTitle: string;
  phaseSlug: string;
  programmePageSlug: string;
};

const getCachedProgrammeCms = cache(
  cacheData(
    async ({
      nonCurriculum,
      subjectTitle,
      phaseSlug,
      programmePageSlug,
    }: ProgrammeCmsParams) => {
      const [curriculumCMSInfo, subjectPhaseSanityData, mvRefreshTime] =
        await Promise.all([
          nonCurriculum
            ? null
            : CMSClient.curriculumOverviewPage({
                previewMode: false,
                subjectTitle,
                phaseSlug,
              }),
          CMSClient.programmePageBySlug(programmePageSlug),
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
  const pageSearchParams = await validateSearchParams(searchParams);

  redirectProgrammeSlugIfNeeded(slug, await searchParams);

  try {
    const cachedData = await getCachedProgrammeData(slug);
    if (!cachedData) {
      return {};
    }

    const canonicalURL = new URL(
      resolveOakHref({
        page: "unit-index",
        programmeSlug: slug,
      }),
      getBrowserConfig("seoAppUrl"),
    ).toString();

    const title = getMetaTitle(cachedData, pageSearchParams);
    const description = `Get fully sequenced teaching resources and lesson plans for ${cachedData.programmeUnitsData.phaseTitle} ${cachedData.programmeUnitsData.subjectTitle}`;

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
  const { slug, tab } = await props.params;
  const searchParams =
    props.searchParams && (await validateSearchParams(props.searchParams));

  redirectProgrammeSlugIfNeeded(slug, searchParams ?? {});

  const subjectPhaseSlug = slug;

  if (!isTabSlug(tab)) {
    return redirect("units");
  }
  const cachedData = await getCachedProgrammeData(subjectPhaseSlug);

  if (!cachedData) {
    return notFound();
  }

  const {
    programmeUnitsData,
    curriculumUnitsData,
    curriculumPhaseOptions,
    subjectPhaseKeystageSlugs,
  } = cachedData;

  const isValid = isValidSubjectPhaseSlug(
    curriculumPhaseOptions.subjects,
    subjectPhaseKeystageSlugs,
  );
  if (!isValid) {
    const redirectParams = getKs4RedirectSlug(
      curriculumPhaseOptions.subjects,
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

  const { curriculumCMSInfo, subjectPhaseSanityData, mvRefreshTime } =
    await getCachedProgrammeCms({
      subjectPhaseSlug,
      nonCurriculum: programmeUnitsData.nonCurriculum,
      subjectTitle: programmeUnitsData.subjectTitle,
      phaseSlug: subjectPhaseKeystageSlugs.phaseSlug,
      programmePageSlug: `${subjectPhaseKeystageSlugs.subjectSlug}-${subjectPhaseKeystageSlugs.phaseSlug}`,
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
    subjectTitle: programmeUnitsData.subjectTitle,
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
    trackingData: curriculumUnitsTrackingData,
    curriculumInfo: cachedData.programmeUnitsData,
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
