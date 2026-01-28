"use client";

import { OakBox, OakTabs } from "@oaknational/oak-components";
import { useMemo } from "react";
import { notFound, useSearchParams, useRouter } from "next/navigation";

import {
  TabName,
  TAB_NAMES,
  TabSlug,
  getTabSlug,
  getTabName,
} from "../tabSchema";

import {
  ProgrammeHeader,
  pickSubjectTitleFromFilters,
} from "./ProgrammeHeader/ProgrammeHeader";
import {
  UnitSequenceView,
  UnitSequenceViewProps,
} from "./UnitSequence/UnitSequenceView";
import { SubjectHeroImageName } from "./ProgrammeHeader/getSubjectHeroImageUrl";

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
import { ProgrammePageHeaderCMS } from "@/common-lib/cms-types/programmePage";

type ProgrammePageProps = {
  curriculumSelectionSlugs: CurriculumSelectionSlugs;
  curriculumPhaseOptions: SubjectPhasePickerData;
  subjectTitle: string;
  phaseTitle: string;
  examboardTitle: string | undefined;
  curriculumUnitsFormattedData: CurriculumUnitsFormattedData;
  subjectPhaseSanityData: ProgrammePageHeaderCMS | null;
  tabSlug: TabSlug;
};

export const ProgrammeView = ({
  curriculumSelectionSlugs,
  curriculumPhaseOptions,
  subjectTitle,
  phaseTitle,
  examboardTitle,
  curriculumUnitsFormattedData,
  subjectPhaseSanityData,
  tabSlug,
}: ProgrammePageProps) => {
  const searchParams = useSearchParams();
  const router = useRouter();

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
        summary={subjectPhaseSanityData?.bodyCopy}
        bullets={subjectPhaseSanityData?.bullets}
        footerSlot={OakTabs<TabName>({
          sizeVariant: ["compact", "default"],
          colorVariant: "black",
          activeTab: getTabName(tabSlug),
          onTabClick: (tabName) => {
            const tabSlug = getTabSlug(tabName);
            router.push(tabSlug, { scroll: false });
          },
          tabs: TAB_NAMES,
        })}
      />
      <TabContent
        tabSlug={tabSlug}
        curriculumPhaseOptions={curriculumPhaseOptions}
        curriculumSelectionSlugs={curriculumSelectionSlugs}
        curriculumUnitsFormattedData={curriculumUnitsFormattedData}
        subjectForLayout={subjectForLayout}
        subjectTitle={subjectTitle}
        filters={filters}
        setFilters={onChangeFilters}
      />
    </>
  );
};

const TabContent = ({
  tabSlug,
  curriculumPhaseOptions,
  curriculumSelectionSlugs,
  curriculumUnitsFormattedData,
  subjectForLayout,
  subjectTitle,
  filters,
  setFilters,
}: { tabSlug: TabSlug } & UnitSequenceViewProps) => {
  if (tabSlug === "units") {
    return (
      <UnitSequenceView
        curriculumPhaseOptions={curriculumPhaseOptions}
        curriculumSelectionSlugs={curriculumSelectionSlugs}
        curriculumUnitsFormattedData={curriculumUnitsFormattedData}
        subjectForLayout={subjectForLayout}
        subjectTitle={subjectTitle}
        filters={filters}
        setFilters={setFilters}
      />
    );
  } else if (tabSlug === "overview") {
    return <OakBox>Overview tab</OakBox>;
  } else if (tabSlug === "download") {
    return <OakBox>Download tab</OakBox>;
  }
  return notFound();
};
