import { notFound, redirect, RedirectType } from "next/navigation";
import { Metadata } from "next";
import { cache } from "react";

import { ProgrammeView } from "./Components/ProgrammeView";
import { isTabSlug } from "./tabSchema";
import { getProgrammeData } from "./getProgrammeData";

import {
  createDownloadsData,
  CurriculumUnitsTrackingData,
  formatCurriculumUnitsData,
} from "@/pages-helpers/curriculum/docx/tab-helpers";
import { getOpenGraphMetadata, getTwitterMetadata } from "@/app/metadata";
import getBrowserConfig from "@/browser-lib/getBrowserConfig";
import OakError from "@/errors/OakError";
import curriculumApi2023 from "@/node-lib/curriculum-api-2023";
import {
  isValidSubjectPhaseSlug,
  getKs4RedirectSlug,
} from "@/utils/curriculum/slugs";
import errorReporter from "@/common-lib/error-reporter";
import withPageErrorHandling, {
  AppPageProps,
} from "@/hocs/withPageErrorHandling";
import CMSClient from "@/node-lib/cms";
import { getMvRefreshTime } from "@/pages-helpers/curriculum/downloads/getMvRefreshTime";
import { getFeatureFlagValue } from "@/utils/featureFlags";
import {
  getKeyStageTitle,
  getYearGroupTitle,
} from "@/utils/curriculum/formatting";

const reportError = errorReporter("programme-page::app");

// Single cached function to fetch all common programme data
// This deduplicates requests between generateMetadata and page component
const getCachedProgrammeData = cache(async (subjectPhaseSlug: string) => {
  return getProgrammeData(curriculumApi2023, subjectPhaseSlug);
});

type ProgrammePageParams = { subjectPhaseSlug: string; tab: string };

export async function generateMetadata({
  params,
  searchParams,
}: {
  params: Promise<ProgrammePageParams>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}): Promise<Metadata> {
  const { subjectPhaseSlug } = await params;
  const { tiers, years, keystages, threads } = await searchParams;

  try {
    const cachedData = await getCachedProgrammeData(subjectPhaseSlug);
    if (!cachedData) {
      return {};
    }

    // Free [phase] [subject] [tier] [exam board] Lesson & Curriculum Resources | Oak National Academy

    const {
      programmeUnitsData,
      curriculumUnitsData,
      curriculumPhaseOptions,
      subjectPhaseKeystageSlugs,
    } = cachedData;

    const curriculumUnitsFormattedData =
      formatCurriculumUnitsData(curriculumUnitsData);

    const ks4Options =
      curriculumPhaseOptions.subjects.find(
        (s) => s.slug === subjectPhaseKeystageSlugs.subjectSlug,
      )?.ks4_options ?? [];
    const ks4Option = ks4Options.find(
      (ks4opt) => ks4opt.slug === subjectPhaseKeystageSlugs.ks4OptionSlug,
    );

    const phaseSubjectSegment = `${programmeUnitsData.phaseTitle} ${programmeUnitsData.subjectTitle}`;

    const keystageSegment =
      typeof keystages === "string" ? getKeyStageTitle(keystages) : null;
    const yearSegment =
      typeof years === "string"
        ? getYearGroupTitle(curriculumUnitsFormattedData.yearData, years)
        : "";
    const threadTitle = curriculumUnitsFormattedData.threadOptions.find(
      (t) => t.slug === threads,
    )?.title;
    const threadSegment =
      typeof threads === "string" && threadTitle ? ` - ${threadTitle}` : "";
    const tierSegment =
      typeof tiers === "string"
        ? ` ${tiers[0]?.toLocaleUpperCase() + tiers.slice(1)}`
        : "";
    const examboardSegment = ks4Option ? ` ${ks4Option.title}` : "";

    const baseMetaTitle = `Free ${phaseSubjectSegment}${tierSegment}${examboardSegment}${threadSegment} Lesson & Curriculum Resources | Oak National Academy`;
    const keystageMetaTitle = keystageSegment
      ? `Free ${keystageSegment} ${programmeUnitsData.subjectTitle}${tierSegment}${examboardSegment} Lesson & Curriculum Resources | Oak National Academy`
      : undefined;
    const yearsMetaTitle = yearSegment
      ? `Free ${yearSegment} ${programmeUnitsData.subjectTitle}${tierSegment}${examboardSegment} Lesson & Curriculum Resources | Oak National Academy`
      : undefined;
    const yearAndThreadMetaTitle =
      yearSegment && threadSegment
        ? `Free ${yearSegment} ${programmeUnitsData.subjectTitle}${tierSegment}${examboardSegment}${threadSegment} Lesson & Curriculum Resources | Oak National Academy`
        : undefined;

    const title =
      yearAndThreadMetaTitle ??
      yearsMetaTitle ??
      keystageMetaTitle ??
      baseMetaTitle;

    const canonicalURL = new URL(
      `/programmes/${subjectPhaseSlug}/units`,
      getBrowserConfig("seoAppUrl"),
    ).toString();

    return {
      title,
      description: title,
      alternates: {
        canonical: canonicalURL,
      },
      openGraph: getOpenGraphMetadata({
        title,
        description: title,
      }),
      twitter: getTwitterMetadata({
        title,
        description: title,
      }),
    };
  } catch (error) {
    reportError(error);
    // Return and fallback to layout metadata
    return {};
  }
}

const InnerProgrammePage = async (props: AppPageProps<ProgrammePageParams>) => {
  const isEnabled = await getFeatureFlagValue(
    "teachers-integrated-journey",
    "boolean",
  );

  if (!isEnabled) {
    return notFound();
  }

  const { subjectPhaseSlug, tab } = await props.params;

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

      return redirect(
        `/programmes/${subjectSlug}-${phaseSlug}-${ks4OptionSlug}/${tab}`,
        RedirectType.replace,
      );
    } else {
      throw new OakError({
        code: "curriculum-api/not-found",
      });
    }
  }

  const [curriculumCMSInfo, subjectPhaseSanityData, mvRefreshTime] =
    await Promise.all([
      programmeUnitsData.nonCurriculum
        ? null
        : CMSClient.curriculumOverviewPage({
            previewMode: false, // TD: [integrated-journey] preview mode
            subjectTitle: programmeUnitsData.subjectTitle,
            phaseSlug: subjectPhaseKeystageSlugs.phaseSlug,
          }),
      CMSClient.programmePageBySlug(
        `${subjectPhaseKeystageSlugs.subjectSlug}-${subjectPhaseKeystageSlugs.phaseSlug}`,
      ),
      getMvRefreshTime(),
    ]);

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
  };

  return <ProgrammeView {...results} />;
};

const ProgrammePage = withPageErrorHandling(
  InnerProgrammePage,
  "programme-page::app",
);

export default ProgrammePage;
