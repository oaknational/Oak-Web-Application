import { notFound } from "next/navigation";
import { uniq } from "lodash";
import { Metadata } from "next";

import { UnitSequenceView } from "./Components/UnitSequence/UnitSequenceView";
import { getCachedProgrammeData } from "./getProgrammeData";
import { tabsMap } from "./layout";

import { formatCurriculumUnitsData } from "@/pages-helpers/curriculum/docx/tab-helpers";
import { getOpenGraphMetadata, getTwitterMetadata } from "@/app/metadata";
import getBrowserConfig from "@/browser-lib/getBrowserConfig";
import { buildCurriculumMetadata } from "@/components/CurriculumComponents/helpers/curriculumMetadata";
import { OakBox } from "@/styles/oakThemeApp";

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

    const tabName = tabsMap[tab];
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

    const curriculumUnitsFormattedData =
      formatCurriculumUnitsData(curriculumUnitsData);

    const subjectForLayout = curriculumPhaseOptions.subjects.find(
      (s) => s.slug === subjectPhaseKeystageSlugs.subjectSlug,
    );

    if (!subjectForLayout) {
      throw new Error(
        "Selected subject not found in curriculumPhaseOptions for programme page",
      );
    }

    return tab === "units" ? (
      <UnitSequenceView
        curriculumPhaseOptions={curriculumPhaseOptions}
        curriculumSelectionSlugs={subjectPhaseKeystageSlugs}
        curriculumUnitsFormattedData={curriculumUnitsFormattedData}
        subjectForLayout={subjectForLayout}
        subjectTitle={programmeUnitsData.subjectTitle}
      />
    ) : tab === "overview" ? (
      <OakBox>Overview tab</OakBox>
    ) : tab === "download" ? (
      <OakBox>Download tab</OakBox>
    ) : (
      notFound()
    );
  } catch (error) {
    // todo error handling
    console.log("diego error", error);
  }
}
