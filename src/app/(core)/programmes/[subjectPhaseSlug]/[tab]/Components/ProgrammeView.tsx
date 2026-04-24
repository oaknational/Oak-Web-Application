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
  ProgrammeDownloads,
  ProgrammeDownloadsProps,
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
import { resolveOakHref } from "@/common-lib/urls";
import { CurriculumOverviewMVData } from "@/node-lib/curriculum-api-2023";
import { useTeacherBrowseStore } from "@/context/TeacherBrowse/TeacherBrowseStoreProvider";

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
  trackingData: CurriculumUnitsTrackingData;
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
  trackingData,
}: ProgrammePageProps) => {
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState<TabSlug>(tabSlug);

  const { examboardTitle } = curriculumSelectionTitles;

  const { subject, phase, year } = useTeacherBrowseStore(
    (s) => s.programmeState,
  );
  console.log("diego year", year, subject, phase);

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

  const schoolYear = year?.id;

  const selectedKeystageSlug = filters.keystages.find(
    (ks) => searchParams?.get("keystages") === ks,
  );
  const heading = buildProgrammeHeading({
    subjectTitle: subject.title,
    data: curriculumUnitsFormattedData,
    filters,
    phaseTitle: phase.title,
    schoolYear,
    keyStage: selectedKeystageSlug,
    examboardTitle,
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

  return (
    <>
      <ProgrammeHeader
        layoutVariant="large"
        subject={subject.slug as SubjectHeroImageName}
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
      />
    );
  } else if (tabSlug === "overview") {
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
