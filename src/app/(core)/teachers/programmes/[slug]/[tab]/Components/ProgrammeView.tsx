"use client";

import { OakMaxWidth, OakTabs } from "@oaknational/oak-components";
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

import { ProgrammeHeader } from "./ProgrammeHeader/ProgrammeHeader";
import { buildProgrammeHeading } from "./ProgrammeHeader/buildProgrammeHeading";
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
  ProgrammeDownloadsProps,
  ProgrammeDownloads,
} from "./ProgrammeDownloads/ProgrammeDownloads";

import {
  CurriculumDownloadsTierSubjectProps,
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
import type { Ks4Option } from "@/node-lib/curriculum-api-2023/queries/curriculumPhaseOptions/curriculumPhaseOptions.schema";
import type { ExamboardFilterDimension } from "@/node-lib/curriculum-api-2023";
import { resolveOakHref } from "@/common-lib/urls";
import { CurriculumOverviewMVData } from "@/node-lib/curriculum-api-2023";
import { validateSearchParams } from "@/utils/validateProgrammePageSearchParams";

type ProgrammePageProps = {
  subjectPhaseSlug: string;
  curriculumSelectionSlugs: CurriculumSelectionSlugs;
  curriculumSelectionTitles: CurriculumSelectionTitles;
  curriculumUnitsFormattedData: CurriculumUnitsFormattedData;
  subjectPhaseSanityData: ProgrammePageHeaderCMS | null;
  curriculumCMSInfo: CurriculumOverviewSanityData | null;
  curriculumInfo: CurriculumOverviewMVData;
  curriculumDownloadsTabData: CurriculumDownloadsTierSubjectProps;
  mvRefreshTime: number;
  tabSlug: TabSlug;
  ks4Options: Ks4Option[];
  examboardFilterDimensions: Record<string, ExamboardFilterDimension>;
  trackingData: CurriculumUnitsTrackingData;
  initialFilter?: CurriculumFilters;
};

export const ProgrammeView = ({
  curriculumSelectionSlugs,
  curriculumSelectionTitles,
  curriculumUnitsFormattedData,
  subjectPhaseSanityData,
  curriculumCMSInfo,
  curriculumInfo,
  curriculumDownloadsTabData,
  mvRefreshTime,
  tabSlug,
  subjectPhaseSlug,
  ks4Options,
  examboardFilterDimensions,
  trackingData,
  initialFilter,
}: ProgrammePageProps) => {
  const searchParams = useSearchParams();

  const { keystages: keystagesParam, years: yearsParam } =
    validateSearchParams(searchParams);

  const [activeTab, setActiveTab] = useState<TabSlug>(tabSlug);

  const { subjectSlug } = curriculumSelectionSlugs;
  const { subjectTitle, phaseTitle, examboardTitle } =
    curriculumSelectionTitles;

  const defaultFilter = useMemo(() => {
    return getDefaultFilter(curriculumUnitsFormattedData);
  }, [curriculumUnitsFormattedData]);

  const [filters, setFilters] = useFilters(defaultFilter, initialFilter);

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

  const schoolYear = filters.years.find((year) => yearsParam === year);

  const selectedKeystageSlug = filters.keystages.find(
    (ks) => keystagesParam === ks,
  );

  const heading = buildProgrammeHeading({
    subjectTitle,
    data: curriculumUnitsFormattedData,
    filters,
    phaseTitle,
    schoolYear,
    keyStage: selectedKeystageSlug,
    examboardTitle,
    tabSlug: activeTab,
  });

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

  const preserveKeystagesParamInUrl = (url: string) => {
    return keystagesParam ? `${url}?keystages=${keystagesParam}` : url;
  };

  return (
    <>
      <ProgrammeHeader
        layoutVariant="large"
        subject={subjectSlug as SubjectHeroImageName}
        heading={heading}
        summary={subjectPhaseSanityData?.bodyCopy}
        bullets={subjectPhaseSanityData?.bullets}
      />
      {curriculumInfo.nonCurriculum ? null : (
        <OakMaxWidth
          as="nav"
          aria-label="Programme page tabs"
          $ph={["spacing-20", "spacing-20", "spacing-0"]}
          $mb={["spacing-0", "spacing-48", "spacing-48"]}
          data-testid="programme-tabs"
        >
          <OakTabs<TabName>
            sizeVariant={["compact", "default"]}
            colorVariant="black"
            activeTab={tabSlugToName[activeTab]}
            onTabClick={(tabName, event) => {
              const tabSlug = tabNameToSlug[tabName];
              // Prevents a full page reload using client side nav
              event.preventDefault();
              const url = preserveKeystagesParamInUrl(tabSlug);
              globalThis.history.pushState(null, "", url);
            }}
            tabs={TAB_NAMES.map((tab) => ({
              label: tab,
              type: "link",
              href: resolveOakHref({
                page: "teacher-programme",
                subjectPhaseSlug,
                tab: tabNameToSlug[tab],
                query: {
                  keystages: keystagesParam ?? undefined,
                },
              }),
            }))}
          />
        </OakMaxWidth>
      )}
      <TabContent
        tabSlug={activeTab}
        curriculumSelectionSlugs={curriculumSelectionSlugs}
        subjectTitle={curriculumSelectionTitles.subjectTitle}
        curriculumUnitsFormattedData={curriculumUnitsFormattedData}
        curriculumCMSInfo={curriculumCMSInfo}
        curriculumDownloadsTabData={curriculumDownloadsTabData}
        curriculumInfo={curriculumInfo}
        mvRefreshTime={mvRefreshTime}
        filters={filters}
        setFilters={onChangeFilters}
        ks4Options={ks4Options}
        examboardFilterDimensions={examboardFilterDimensions}
      />
    </>
  );
};

const TabContent = ({
  tabSlug,
  curriculumSelectionSlugs,
  subjectTitle,
  curriculumUnitsFormattedData,
  curriculumCMSInfo,
  curriculumInfo,
  curriculumDownloadsTabData,
  mvRefreshTime,
  filters,
  setFilters,
  ks4Options,
  examboardFilterDimensions,
}: { tabSlug: TabSlug } & UnitSequenceViewProps &
  Omit<ProgrammeOverviewProps, "curriculumCMSInfo"> & {
    curriculumCMSInfo: CurriculumOverviewSanityData | null;
  } & ProgrammeDownloadsProps) => {
  if (tabSlug === "units") {
    return (
      <UnitSequenceView
        curriculumSelectionSlugs={curriculumSelectionSlugs}
        curriculumUnitsFormattedData={curriculumUnitsFormattedData}
        filters={filters}
        setFilters={setFilters}
        ks4Options={ks4Options}
        examboardFilterDimensions={examboardFilterDimensions}
      />
    );
  } else if (tabSlug === "curriculum-explainer") {
    if (!curriculumCMSInfo) {
      notFound();
    }
    return (
      <ProgrammeOverview
        subjectTitle={subjectTitle}
        curriculumCMSInfo={curriculumCMSInfo}
        curriculumSelectionSlugs={curriculumSelectionSlugs}
      />
    );
  } else if (tabSlug === "download") {
    return (
      <ProgrammeDownloads
        mvRefreshTime={mvRefreshTime}
        curriculumSelectionSlugs={curriculumSelectionSlugs}
        curriculumDownloadsTabData={curriculumDownloadsTabData}
        curriculumInfo={curriculumInfo}
        curriculumUnitsFormattedData={curriculumUnitsFormattedData}
      />
    );
  }
  return notFound();
};
