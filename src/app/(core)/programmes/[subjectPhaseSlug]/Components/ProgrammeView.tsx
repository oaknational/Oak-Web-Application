"use client";

import { OakHeading, OakTabs } from "@oaknational/oak-components";
import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";

import {
  ProgrammeHeader,
  pickSubjectTitleFromFilters,
} from "./ProgrammeHeader/ProgrammeHeader";
import { SubjectHeroImageName } from "./ProgrammeHeader/getSubjectHeroImageUrl";
import { UnitSequenceView } from "./UnitSequence/UnitSequenceView";

import { SubjectPhasePickerData } from "@/components/SharedComponents/SubjectPhasePicker/SubjectPhasePicker";
import { CurriculumUnitsFormattedData } from "@/pages-helpers/curriculum/docx/tab-helpers";
import { getDefaultFilter, useFilters } from "@/utils/curriculum/filteringApp";
import { CurriculumSelectionSlugs } from "@/utils/curriculum/slugs";

type ProgrammePageProps = {
  curriculumSelectionSlugs: CurriculumSelectionSlugs;
  curriculumPhaseOptions: SubjectPhasePickerData;
  subjectTitle: string;
  phaseTitle: string;
  examboardTitle: string | undefined;
  curriculumUnitsFormattedData: CurriculumUnitsFormattedData;
};

const TAB_OPTIONS = ["Unit sequence", "Explainer", "Download"];
type TabOption = (typeof TAB_OPTIONS)[number];

export const ProgrammeView = ({
  curriculumSelectionSlugs,
  curriculumPhaseOptions,
  subjectTitle,
  phaseTitle,
  examboardTitle,
  curriculumUnitsFormattedData,
}: ProgrammePageProps) => {
  const searchParams = useSearchParams();

  const defaultFilter = useMemo(() => {
    return getDefaultFilter(curriculumUnitsFormattedData);
  }, [curriculumUnitsFormattedData]);
  const [filters, setFilters] = useFilters(defaultFilter);
  const [activeTab, setActiveTab] = useState<TabOption>("Unit sequence");

  const subjectForLayout = curriculumPhaseOptions.subjects.find(
    (s) => s.slug === curriculumSelectionSlugs.subjectSlug,
  );

  if (!subjectForLayout) {
    throw new Error(
      "Selected subject not found in curriculumPhaseOptions for programme page",
    );
  }

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
        footerSlot={OakTabs<TabOption>({
          sizeVariant: ["compact", "default"],
          colorVariant: "black",
          activeTab,
          onTabClick: (tab) => setActiveTab(tab),
          tabs: TAB_OPTIONS,
        })}
      />
      {/* TD: [integrate journey] move to separate pages for each tab */}
      {activeTab === "Unit sequence" ? (
        <UnitSequenceView
          curriculumPhaseOptions={curriculumPhaseOptions}
          curriculumSelectionSlugs={curriculumSelectionSlugs}
          curriculumUnitsFormattedData={curriculumUnitsFormattedData}
          filters={filters}
          setFilters={setFilters}
          subjectForLayout={subjectForLayout}
          subjectTitle={subjectTitle}
        />
      ) : activeTab === "Explainer" ? (
        <OakHeading tag="h3">Explainer tab</OakHeading>
      ) : (
        <OakHeading tag="h3">Download tab</OakHeading>
      )}
    </>
  );
};
