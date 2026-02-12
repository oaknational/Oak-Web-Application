import { notFound, redirect, RedirectType } from "next/navigation";
import { uniq } from "lodash";
import { Metadata } from "next";
import { cache } from "react";

import { ProgrammeView } from "./Components/ProgrammeView";
import { isTabSlug } from "./tabSchema";
import { getProgrammeData } from "./getProgrammeData";

import { formatCurriculumUnitsData } from "@/pages-helpers/curriculum/docx/tab-helpers";
import { getOpenGraphMetadata, getTwitterMetadata } from "@/app/metadata";
import getBrowserConfig from "@/browser-lib/getBrowserConfig";
import { buildCurriculumMetadata } from "@/components/CurriculumComponents/helpers/curriculumMetadata";
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
import { useFeatureFlag } from "@/utils/featureFlags";
import CMSClient from "@/node-lib/cms";

const reportError = errorReporter("programme-page::app");

// Single cached function to fetch all common programme data
// This deduplicates requests between generateMetadata and page component
const getCachedProgrammeData = cache(async (subjectPhaseSlug: string) => {
  return getProgrammeData(curriculumApi2023, subjectPhaseSlug);
});

type ProgrammePageParams = { subjectPhaseSlug: string; tab: string };

export async function generateMetadata({
  params,
}: {
  params: Promise<ProgrammePageParams>;
}): Promise<Metadata> {
  const { subjectPhaseSlug } = await params;

  try {
    const cachedData = await getCachedProgrammeData(subjectPhaseSlug);
    if (!cachedData) {
      return {};
    }

    const {
      programmeUnitsData,
      curriculumUnitsData,
      curriculumPhaseOptions,
      subjectPhaseKeystageSlugs,
    } = cachedData;

    const curriculumUnitsFormattedData =
      formatCurriculumUnitsData(curriculumUnitsData);

    // Extract keyStages from yearData
    const keyStages = uniq(
      Object.values(curriculumUnitsFormattedData.yearData).flatMap(
        ({ units }) => units.map((unit) => unit.keystage_slug),
      ),
    );
    const ks4Options =
      curriculumPhaseOptions.subjects.find(
        (s) => s.slug === subjectPhaseKeystageSlugs.subjectSlug,
      )?.ks4_options ?? [];
    const ks4Option = ks4Options.find(
      (ks4opt) => ks4opt.slug === subjectPhaseKeystageSlugs.ks4OptionSlug,
    );

    const title = buildCurriculumMetadata({
      metadataType: "title",
      subjectSlug: subjectPhaseKeystageSlugs.subjectSlug,
      subjectTitle: programmeUnitsData.subjectTitle,
      ks4OptionSlug: ks4Option?.slug ?? null,
      ks4OptionTitle: ks4Option?.title ?? null,
      keyStages: keyStages,
      tab: "units",
    });
    const description = buildCurriculumMetadata({
      metadataType: "description",
      subjectSlug: subjectPhaseKeystageSlugs.subjectSlug,
      subjectTitle: programmeUnitsData.subjectTitle,
      ks4OptionSlug: ks4Option?.slug ?? null,
      ks4OptionTitle: ks4Option?.title ?? null,
      keyStages: keyStages,
      tab: "units",
    });
    const canonicalURL = new URL(
      `/programmes/${subjectPhaseSlug}`,
      getBrowserConfig("seoAppUrl"),
    ).toString();

    return {
      title,
      description,
      alternates: {
        canonical: canonicalURL,
      },
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
  // `useFeatureFlag` is not a hook
  const isEnabled = await useFeatureFlag(
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

  const validSubjectPhases = await curriculumApi2023.curriculumPhaseOptions();
  const isValid = isValidSubjectPhaseSlug(
    validSubjectPhases,
    subjectPhaseKeystageSlugs,
  );
  if (!isValid) {
    const redirectParams = getKs4RedirectSlug(
      validSubjectPhases,
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

  const curriculumCMSInfo = await CMSClient.curriculumOverviewPage({
    previewMode: false, // TD: [integrated-journey] preview mode
    subjectTitle: programmeUnitsData.subjectTitle,
    phaseSlug: subjectPhaseKeystageSlugs.phaseSlug,
  });

  // TD: [integrated-journey] This data is not used in `ProgrammeView`, maybe we can remove it?
  if (!curriculumCMSInfo) {
    return notFound();
  }

  const subjectPhaseSanityData = await CMSClient.programmePageBySlug(
    `${subjectPhaseKeystageSlugs.subjectSlug}-${subjectPhaseKeystageSlugs.phaseSlug}`,
  );

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

  // Find examboard title from subject phases
  const ks4Option = validSubjectPhases
    .flatMap((subject) => subject.ks4_options)
    .find((ks4opt) => ks4opt?.slug === subjectPhaseKeystageSlugs.ks4OptionSlug);

  const results = {
    curriculumSelectionSlugs: subjectPhaseKeystageSlugs,
    curriculumPhaseOptions,
    subjectTitle: programmeUnitsData.subjectTitle,
    phaseTitle: programmeUnitsData.phaseTitle,
    examboardTitle: ks4Option?.title,
    curriculumUnitsFormattedData,
    subjectPhaseSanityData,
    tabSlug: tab,
    curriculumCMSInfo,
    curriculumInfo: cachedData.programmeUnitsData,
  };

  return <ProgrammeView {...results} />;
};

const ProgrammePage = withPageErrorHandling(
  InnerProgrammePage,
  "programme-page::app",
);

export default ProgrammePage;
