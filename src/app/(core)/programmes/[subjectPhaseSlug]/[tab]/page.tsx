import { notFound, redirect, RedirectType } from "next/navigation";
import { uniq } from "lodash";
import { Metadata } from "next";
import { cache } from "react";

import { ProgrammeView } from "./Components/ProgrammeView";
import { tabSlugToName } from "./tabSchema";
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

const reportError = errorReporter("programme-page::app");

// Single cached function to fetch all common programme data
// This deduplicates requests between generateMetadata and page component
const getCachedProgrammeData = cache(async (subjectPhaseSlug: string) => {
  return getProgrammeData(curriculumApi2023, subjectPhaseSlug);
});

export async function generateMetadata({
  params,
}: PageProps<"/programmes/[subjectPhaseSlug]/[tab]">): Promise<Metadata> {
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

export default async function ProgrammePageTabs({
  params,
}: {
  params: Promise<{ subjectPhaseSlug: string; tab: string }>;
}) {
  try {
    const { subjectPhaseSlug, tab } = await params;

    const tabName = tabSlugToName[tab];
    if (!tabName) {
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

    const curriculumUnitsFormattedData =
      formatCurriculumUnitsData(curriculumUnitsData);

    // Find examboard title from subject phases
    const ks4Option = validSubjectPhases
      .flatMap((subject) => subject.ks4_options)
      .find(
        (ks4opt) => ks4opt?.slug === subjectPhaseKeystageSlugs.ks4OptionSlug,
      );

    const subjectForLayout = curriculumPhaseOptions.subjects.find(
      (s) => s.slug === subjectPhaseKeystageSlugs.subjectSlug,
    );

    if (!subjectForLayout) {
      throw new Error(
        "Selected subject not found in curriculumPhaseOptions for programme page",
      );
    }

    const results = {
      curriculumSelectionSlugs: subjectPhaseKeystageSlugs,
      curriculumPhaseOptions,
      subjectTitle: programmeUnitsData.subjectTitle,
      phaseTitle: programmeUnitsData.phaseTitle,
      examboardTitle: ks4Option?.title,
      curriculumUnitsFormattedData,
      tabSlug: tab,
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
}
