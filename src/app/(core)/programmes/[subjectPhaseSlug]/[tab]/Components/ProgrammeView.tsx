"use client";

import { OakBox, OakMaxWidth, OakTabs } from "@oaknational/oak-components";
import { useEffect, useMemo, useState } from "react";
import { notFound, usePathname, useSearchParams } from "next/navigation";

import {
  TabName,
  TAB_NAMES,
  TabSlug,
  tabNameToSlug,
  tabSlugToName,
  isTabSlug,
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
import {
  ProgrammeOverview,
  ProgrammeOverviewProps,
} from "./ProgrammeOverview/ProgrammeOverview";

import {
  CurriculumUnitsFormattedData,
  CurriculumUnitsTrackingData,
} from "@/pages-helpers/curriculum/docx/tab-helpers";
import { getDefaultFilter, useFilters } from "@/utils/curriculum/filteringApp";
import {
  CurriculumSelectionSlugs,
  CurriculumSelectionTitles,
} from "@/utils/curriculum/slugs";
import { CurriculumFilters } from "@/utils/curriculum/types";
import useAnalytics from "@/context/Analytics/useAnalytics";
import { buildUnitSequenceRefinedAnalytics } from "@/utils/curriculum/analytics";
import useAnalyticsPageProps from "@/hooks/useAnalyticsPageProps";
import { ProgrammePageHeaderCMS } from "@/common-lib/cms-types/programmePage";
import { CurriculumOverviewSanityData } from "@/common-lib/cms-types";
import { CurriculumOverviewMVData } from "@/node-lib/curriculum-api-2023";
import { Ks4Option } from "@/node-lib/curriculum-api-2023/queries/curriculumPhaseOptions/curriculumPhaseOptions.schema";

type ProgrammePageProps = {
  curriculumSelectionSlugs: CurriculumSelectionSlugs;
  curriculumSelectionTitles: CurriculumSelectionTitles;
  curriculumUnitsFormattedData: CurriculumUnitsFormattedData;
  subjectPhaseSanityData: ProgrammePageHeaderCMS | null;
  curriculumCMSInfo: CurriculumOverviewSanityData;
  curriculumInfo: CurriculumOverviewMVData;
  tabSlug: TabSlug;
  ks4Options: Ks4Option[];
};

export const ProgrammeView = ({
  curriculumSelectionSlugs,
  curriculumSelectionTitles,
  curriculumUnitsFormattedData,
  subjectPhaseSanityData,
  curriculumCMSInfo,
  curriculumInfo,
  tabSlug,
  ks4Options,
}: ProgrammePageProps) => {
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState<TabSlug>(tabSlug);

  const { subjectSlug, ks4OptionSlug, phaseSlug } = curriculumSelectionSlugs;
  const { subjectTitle, phaseTitle, examboardTitle } =
    curriculumSelectionTitles;

  // TD: [integrated journey] tracking
  const curriculumUnitsTrackingData: CurriculumUnitsTrackingData = {
    subjectSlug,
    phaseSlug,
    subjectTitle,
    ks4OptionSlug,
    ks4OptionTitle: examboardTitle,
  };

  const defaultFilter = useMemo(() => {
    return getDefaultFilter(curriculumUnitsFormattedData);
  }, [curriculumUnitsFormattedData]);

  const [filters, setFilters] = useFilters(defaultFilter);

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

  // Ensure the active tab matches the one in the latest pathname
  const pathname = usePathname();
  useEffect(() => {
    if (pathname) {
      const tab = pathname.split("/").pop();
      if (isTabSlug(tab)) {
        setActiveTab(tab);
      }
    }
  }, [pathname]);

  return (
    <>
      <ProgrammeHeader
        subject={subjectSlug as SubjectHeroImageName}
        subjectTitle={
          pickSubjectTitleFromFilters(curriculumUnitsFormattedData, filters) ??
          subjectTitle
        }
        phaseTitle={phaseTitle}
        examboardTitle={examboardTitle}
        schoolYear={schoolYear}
        summary={subjectPhaseSanityData?.bodyCopy}
        bullets={subjectPhaseSanityData?.bullets}
      />
      <OakMaxWidth $ph={["spacing-20", "spacing-20", "spacing-0"]}>
        <OakTabs<TabName>
          sizeVariant={["compact", "default"]}
          colorVariant="black"
          activeTab={tabSlugToName[activeTab]}
          onTabClick={(tabName) => {
            const tabSlug = tabNameToSlug[tabName];
            // Prevents a full page reload using client side nav
            globalThis.history.pushState(null, "", tabSlug);
          }}
          tabs={[...TAB_NAMES]}
        />
      </OakMaxWidth>
      <TabContent
        tabSlug={activeTab}
        curriculumSelectionSlugs={curriculumSelectionSlugs}
        curriculumSelectionTitles={curriculumSelectionTitles}
        curriculumUnitsFormattedData={curriculumUnitsFormattedData}
        curriculumInfo={curriculumInfo}
        curriculumCMSInfo={curriculumCMSInfo}
        filters={filters}
        setFilters={onChangeFilters}
        ks4Options={ks4Options}
      />
    </>
  );
};

const TabContent = ({
  tabSlug,
  curriculumSelectionSlugs,
  curriculumSelectionTitles,
  curriculumInfo,
  curriculumUnitsFormattedData,
  curriculumCMSInfo,
  filters,
  setFilters,
  ks4Options,
}: { tabSlug: TabSlug } & UnitSequenceViewProps & ProgrammeOverviewProps) => {
  if (tabSlug === "units") {
    return (
      <OakMaxWidth>
        <UnitSequenceView
          curriculumSelectionSlugs={curriculumSelectionSlugs}
          curriculumUnitsFormattedData={curriculumUnitsFormattedData}
          curriculumSelectionTitles={curriculumSelectionTitles}
          filters={filters}
          setFilters={setFilters}
          ks4Options={ks4Options}
        />
      </OakMaxWidth>
    );
  } else if (tabSlug === "overview") {
    return (
      <ProgrammeOverview
        curriculumInfo={curriculumInfo}
        curriculumCMSInfo={curriculumCMSInfo}
        curriculumSelectionSlugs={curriculumSelectionSlugs}
      />
    );
  } else if (tabSlug === "download") {
    return <OakBox>Download tab</OakBox>;
  }
  return notFound();
};
