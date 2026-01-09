import { notFound, redirect, RedirectType } from "next/navigation";
import { Metadata } from "next";
import React, { cache } from "react";
import { uniq } from "lodash";

import { ProgrammeView } from "./Components/ProgrammeView";

import {
  getKs4RedirectSlug,
  isValidSubjectPhaseSlug,
  parseSubjectPhaseSlug,
} from "@/utils/curriculum/slugs";
import curriculumApi2023, {
  CurriculumUnit,
} from "@/node-lib/curriculum-api-2023";
import OakError from "@/errors/OakError";
import CMSClient from "@/node-lib/cms";
import {
  formatCurriculumUnitsData,
  fetchSubjectPhasePickerData,
} from "@/pages-helpers/curriculum/docx/tab-helpers";
import { buildCurriculumMetadata } from "@/components/CurriculumComponents/helpers/curriculumMetadata";
import getBrowserConfig from "@/browser-lib/getBrowserConfig";
import { getOpenGraphMetadata, getTwitterMetadata } from "@/app/metadata";
import { useFeatureFlag } from "@/utils/featureFlags";

// TD: [integrated journey] get revalidate from env somehow
export const revalidate = 7200;

// Helper function to sort units consistently
const sortUnits = (units: CurriculumUnit[]): CurriculumUnit[] => {
  const sorted = [...units];
  // Sort units to have examboard versions first
  sorted.sort((a) => {
    if (a.examboard) {
      return -1;
    }
    return 1;
  });
  // Sort by unit order
  sorted.sort((a, b) => a.order - b.order);
  return sorted;
};

// Single cached function to fetch all common programme data
// This deduplicates requests between generateMetadata and page component
const getCachedProgrammeData = cache(async (subjectPhaseSlug: string) => {
  const subjectPhaseKeystageSlugs = parseSubjectPhaseSlug(subjectPhaseSlug);

  if (!subjectPhaseKeystageSlugs) {
    return null;
  }

  const [programmeUnitsData, curriculumUnitsData, curriculumPhaseOptions] =
    await Promise.all([
      curriculumApi2023.curriculumOverview({
        subjectSlug: subjectPhaseKeystageSlugs.subjectSlug,
        phaseSlug: subjectPhaseKeystageSlugs.phaseSlug,
      }),
      curriculumApi2023.curriculumSequence(subjectPhaseKeystageSlugs),
      fetchSubjectPhasePickerData(),
    ]);

  // Sort units to have examboard versions first, then by unit order
  curriculumUnitsData.units = sortUnits(curriculumUnitsData.units);

  return {
    programmeUnitsData,
    curriculumUnitsData,
    curriculumPhaseOptions,
    subjectPhaseKeystageSlugs,
  };
});

type ProgrammePageProps = {
  params: Promise<{ subjectPhaseSlug: string }>;
};

export async function generateMetadata({
  params,
}: ProgrammePageProps): Promise<Metadata> {
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
    // Return and fallback to layout metadata
    return {};
  }
}

const ProgrammePage = async ({ params }: ProgrammePageProps) => {
  const isEnabled = await useFeatureFlag(
    "teachers-integrated-journey",
    "boolean",
  );
  try {
    const { subjectPhaseSlug } = await params;

    if (!isEnabled) {
      return notFound();
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
          `/programmes/${subjectSlug}-${phaseSlug}-${ks4OptionSlug}`,
          RedirectType.replace,
        );
      } else {
        throw new OakError({
          code: "curriculum-api/not-found",
        });
      }
    }

    const curriculumOverviewSanityData = await CMSClient.curriculumOverviewPage(
      {
        previewMode: false, // TD: [integrated-journey] preview mode
        subjectTitle: programmeUnitsData.subjectTitle,
        phaseSlug: subjectPhaseKeystageSlugs.phaseSlug,
      },
    );

    if (!curriculumOverviewSanityData) {
      return notFound();
    }

    const curriculumUnitsFormattedData =
      formatCurriculumUnitsData(curriculumUnitsData);

    const results = {
      curriculumSelectionSlugs: subjectPhaseKeystageSlugs,
      curriculumPhaseOptions,
      subjectTitle: programmeUnitsData.subjectTitle,
      curriculumOverviewSanityData,
      curriculumUnitsFormattedData,
    };

    return <ProgrammeView {...results} />;
  } catch (error) {
    if (error instanceof OakError) {
      if (error.config.responseStatusCode === 404) {
        return notFound();
      }
    }
    // TD: [integrated journey] error reporting
    throw error;
  }
};

export default ProgrammePage;
