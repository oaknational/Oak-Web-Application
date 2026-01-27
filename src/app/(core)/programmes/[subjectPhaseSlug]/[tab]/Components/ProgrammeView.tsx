"use client";

import { OakBox, OakTabs } from "@oaknational/oak-components";
import { useMemo } from "react";
import { notFound, useSearchParams } from "next/navigation";

import { TabName, TAB_NAMES, TabSlug, tabSlugToName } from "../tabSchema";

import {
  ProgrammeHeader,
  pickSubjectTitleFromFilters,
} from "./ProgrammeHeader";
import { SubjectHeroImageName } from "./getSubjectHeroImageUrl";
import { UnitSequenceView } from "./UnitSequence/UnitSequenceView";

import { SubjectPhasePickerData } from "@/components/SharedComponents/SubjectPhasePicker/SubjectPhasePicker";
import {
  CurriculumUnitsFormattedData,
  CurriculumUnitsTrackingData,
} from "@/pages-helpers/curriculum/docx/tab-helpers";
import { getDefaultFilter, useFilters } from "@/utils/curriculum/filteringApp";
import { CurriculumSelectionSlugs } from "@/utils/curriculum/slugs";
import { CurriculumFilters } from "@/utils/curriculum/types";
import useAnalytics from "@/context/Analytics/useAnalytics";
import { buildUnitSequenceRefinedAnalytics } from "@/utils/curriculum/analytics";
import useAnalyticsPageProps from "@/hooks/useAnalyticsPageProps";

type ProgrammePageProps = {
  curriculumSelectionSlugs: CurriculumSelectionSlugs;
  curriculumPhaseOptions: SubjectPhasePickerData;
  subjectTitle: string;
  phaseTitle: string;
  examboardTitle: string | undefined;
  curriculumUnitsFormattedData: CurriculumUnitsFormattedData;
  tabSlug: TabSlug;
};

export const ProgrammeView = ({
  curriculumSelectionSlugs,
  curriculumPhaseOptions,
  subjectTitle,
  phaseTitle,
  examboardTitle,
  curriculumUnitsFormattedData,
  tabSlug,
}: ProgrammePageProps) => {
  const searchParams = useSearchParams();

  const { subjectSlug, ks4OptionSlug, phaseSlug } = curriculumSelectionSlugs;

  const ks4Options =
    curriculumPhaseOptions.subjects.find((s) => s.slug === subjectSlug)!
      .ks4_options ?? [];
  const ks4Option = ks4Options.find((ks4opt) => ks4opt.slug === ks4OptionSlug);

  // TD: [integrated journey] tracking
  const curriculumUnitsTrackingData: CurriculumUnitsTrackingData = {
    subjectSlug,
    phaseSlug,
    subjectTitle,
    ks4OptionSlug: ks4Option?.slug,
    ks4OptionTitle: ks4Option?.title,
  };

  const defaultFilter = useMemo(() => {
    return getDefaultFilter(curriculumUnitsFormattedData);
  }, [curriculumUnitsFormattedData]);

  const [filters, setFilters] = useFilters(defaultFilter);

  const subjectForLayout = curriculumPhaseOptions.subjects.find(
    (s) => s.slug === curriculumSelectionSlugs.subjectSlug,
  );

  if (!subjectForLayout) {
    throw new Error(
      "Selected subject not found in curriculumPhaseOptions for programme page",
    );
  }

  const { track } = useAnalytics();
  const { analyticsUseCase } = useAnalyticsPageProps();

  const onChangeFilters = (newFilters: CurriculumFilters) => {
    setFilters(newFilters);

    const analyticsData = buildUnitSequenceRefinedAnalytics(
      analyticsUseCase,
      curriculumUnitsTrackingData,
      newFilters,
    );

    track.unitSequenceRefined(analyticsData);
  };

  const schoolYear = filters.years.find(
    (year) => searchParams?.get("years") === year,
  );

  return (
    <>
      <ProgrammeHeader
        subject={subjectForLayout.slug as SubjectHeroImageName}
        subjectTitle={
          pickSubjectTitleFromFilters(curriculumUnitsFormattedData, filters) ??
          subjectTitle
        }
        phaseTitle={phaseTitle}
        examboardTitle={examboardTitle}
        schoolYear={schoolYear}
        summary="This is some placeholder text for the summary. If this goes into production then we've still got work to do."
        bullets={[
          "This is a bullet point",
          "This is another bullet point",
          "This is a third bullet point",
        ]}
        footerSlot={OakTabs<TabName>({
          sizeVariant: ["compact", "default"],
          colorVariant: "black",
          activeTab: tabSlugToName[tabSlug] as TabName,
          onTabClick: () => {
            // TODO: navigation
          },
          tabs: TAB_NAMES,
        })}
      />
      {tabSlug === "units" ? (
        <UnitSequenceView
          curriculumPhaseOptions={curriculumPhaseOptions}
          curriculumSelectionSlugs={curriculumSelectionSlugs}
          curriculumUnitsFormattedData={curriculumUnitsFormattedData}
          subjectForLayout={subjectForLayout}
          subjectTitle={subjectTitle}
          filters={filters}
          setFilters={onChangeFilters}
        />
      ) : tabSlug === "overview" ? (
        <OakBox>Overview tab</OakBox>
      ) : tabSlug === "download" ? (
        <OakBox>Download tab</OakBox>
      ) : (
        notFound()
      )}
    </>
  );
};
