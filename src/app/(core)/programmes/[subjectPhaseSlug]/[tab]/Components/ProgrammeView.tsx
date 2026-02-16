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
import { resolveOakHref } from "@/common-lib/urls";
import { Ks4Option } from "@/node-lib/curriculum-api-2023/queries/curriculumPhaseOptions/curriculumPhaseOptions.schema";

type ProgrammePageProps = {
  subjectPhaseSlug: string;
  curriculumSelectionSlugs: CurriculumSelectionSlugs;
  curriculumSelectionTitles: CurriculumSelectionTitles;
  curriculumUnitsFormattedData: CurriculumUnitsFormattedData;
  subjectPhaseSanityData: ProgrammePageHeaderCMS | null;
  curriculumCMSInfo: CurriculumOverviewSanityData;
  tabSlug: TabSlug;
  ks4Options: Ks4Option[];
  trackingData: CurriculumUnitsTrackingData;
};

export const ProgrammeView = ({
  curriculumSelectionSlugs,
  curriculumSelectionTitles,
  curriculumUnitsFormattedData,
  subjectPhaseSanityData,
  curriculumCMSInfo,
  tabSlug,
  subjectPhaseSlug,
  ks4Options,
  trackingData,
}: ProgrammePageProps) => {
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState<TabSlug>(tabSlug);

  const { subjectSlug } = curriculumSelectionSlugs;
  const { subjectTitle, phaseTitle, examboardTitle } =
    curriculumSelectionTitles;

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
      trackingData,
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
          onTabClick={(tabName, event) => {
            const tabSlug = tabNameToSlug[tabName];
            // Prevents a full page reload using client side nav
            event.preventDefault();
            globalThis.history.pushState(null, "", tabSlug);
          }}
          tabs={TAB_NAMES.map((tab) => ({
            label: tab,
            type: "link",
            href: resolveOakHref({
              page: "teacher-programme",
              subjectPhaseSlug,
              tab: tabNameToSlug[tab],
            }),
          }))}
        />
      </OakMaxWidth>
      <TabContent
        tabSlug={activeTab}
        curriculumSelectionSlugs={curriculumSelectionSlugs}
        curriculumSelectionTitles={curriculumSelectionTitles}
        curriculumUnitsFormattedData={curriculumUnitsFormattedData}
        curriculumCMSInfo={curriculumCMSInfo}
        filters={filters}
        setFilters={onChangeFilters}
        ks4Options={ks4Options}
        trackingData={trackingData}
      />
    </>
  );
};

const TabContent = ({
  tabSlug,
  curriculumSelectionSlugs,
  curriculumSelectionTitles,
  curriculumUnitsFormattedData,
  curriculumCMSInfo,
  filters,
  setFilters,
  ks4Options,
  trackingData,
}: { tabSlug: TabSlug } & UnitSequenceViewProps &
  Omit<ProgrammeOverviewProps, "subjectTitle">) => {
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
          trackingData={trackingData}
        />
      </OakMaxWidth>
    );
  } else if (tabSlug === "overview") {
    return (
      <ProgrammeOverview
        subjectTitle={curriculumSelectionTitles.subjectTitle}
        curriculumCMSInfo={curriculumCMSInfo}
        curriculumSelectionSlugs={curriculumSelectionSlugs}
      />
    );
  } else if (tabSlug === "download") {
    return <OakBox>Download tab</OakBox>;
  }
  return notFound();
};
