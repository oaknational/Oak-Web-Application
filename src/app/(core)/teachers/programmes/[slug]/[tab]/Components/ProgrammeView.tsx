"use client";

import { OakMaxWidth, OakTabs } from "@oaknational/oak-components";
import { useEffect, useState } from "react";
import { notFound, usePathname, useSearchParams } from "next/navigation";

import {
  TabName,
  TAB_NAMES,
  TabSlug,
  tabNameToSlug,
  tabSlugToName,
  isTabSlug,
} from "../tabSchema";
import type { Ks4OptionFilterDimension } from "../buildKs4OptionFilterDimensions";

import { ProgrammeHeader } from "./ProgrammeHeader/ProgrammeHeader";
import { buildProgrammeHeading } from "./ProgrammeHeader/buildProgrammeHeading";
import {
  UnitSequenceView,
  UnitSequenceViewProps,
} from "./UnitSequence/UnitSequenceView";
import { SubjectHeroImageName } from "./ProgrammeHeader/getSubjectHeroImageUrl";
import { ProgrammeOverview } from "./ProgrammeOverview/ProgrammeOverview";
import {
  ProgrammeDownloadsProps,
  ProgrammeDownloads,
} from "./ProgrammeDownloads/ProgrammeDownloads";
import { ImplementationGuideCallout } from "./ImplementationGuideCallout";

import {
  CurriculumDownloadsTierSubjectProps,
  CurriculumUnitsFormattedData,
} from "@/pages-helpers/curriculum/docx/tab-helpers";
import {
  CurriculumSelectionSlugs,
  CurriculumSelectionTitles,
} from "@/utils/curriculum/slugs";
import { ProgrammePageHeaderCMS } from "@/common-lib/cms-types/programmePage";
import { CurriculumOverviewSanityData } from "@/common-lib/cms-types";
import type { Ks4Option } from "@/node-lib/curriculum-api-2023/queries/curriculumPhaseOptions/curriculumPhaseOptions.schema";
import { resolveOakHref } from "@/common-lib/urls";
import { validateSearchParams } from "@/utils/validateProgrammePageSearchParams";
import { useBrowseFilters } from "@/context/BrowseFilters";

export type ProgrammePageProps = {
  subjectPhaseSlug: string;
  curriculumSelectionSlugs: CurriculumSelectionSlugs;
  curriculumSelectionTitles: CurriculumSelectionTitles;
  curriculumUnitsFormattedData: CurriculumUnitsFormattedData;
  subjectPhaseSanityData: ProgrammePageHeaderCMS | null;
  curriculumCMSInfo: CurriculumOverviewSanityData | null;
  nonCurriculum: boolean;
  curriculumDownloadsTabData: CurriculumDownloadsTierSubjectProps;
  mvRefreshTime: number;
  tabSlug: TabSlug;
  ks4Options: Ks4Option[];
  ks4OptionFilterDimensions: Record<string, Ks4OptionFilterDimension>;
  featureFlags: Record<string, boolean>;
};

export const ProgrammeView = ({
  curriculumSelectionSlugs,
  curriculumSelectionTitles,
  curriculumUnitsFormattedData,
  subjectPhaseSanityData,
  curriculumCMSInfo,
  nonCurriculum,
  curriculumDownloadsTabData,
  mvRefreshTime,
  tabSlug,
  subjectPhaseSlug,
  ks4Options,
  ks4OptionFilterDimensions,
  featureFlags,
}: ProgrammePageProps) => {
  const searchParams = useSearchParams();

  const validatedParams = validateSearchParams(searchParams);

  const [activeTab, setActiveTab] = useState<TabSlug>(tabSlug);

  const { subjectSlug } = curriculumSelectionSlugs;
  const { subjectTitle, phaseTitle, examboardTitle } =
    curriculumSelectionTitles;

  const { filters, onChangeFilters } = useBrowseFilters();

  const schoolYear = filters.years.find(
    (year) => validatedParams?.years === year,
  );

  const selectedKeystageSlug = filters.keystages.find(
    (ks) => validatedParams?.keystages === ks,
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
    return validatedParams?.keystages
      ? `${url}?keystages=${validatedParams?.keystages}`
      : url;
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
      {nonCurriculum ? null : (
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
              showPromo:
                featureFlags["implementation-guides"] &&
                tabNameToSlug[tab] === "download",
              href: resolveOakHref({
                page: "teacher-programme",
                subjectPhaseSlug,
                tab: tabNameToSlug[tab],
                query: {
                  keystages: validatedParams?.keystages,
                },
              }),
            }))}
          />
          {["units", "curriculum-explainer"].includes(activeTab) &&
            featureFlags["implementation-guides"] && (
              <ImplementationGuideCallout
                subject={curriculumSelectionSlugs.subjectSlug}
                subjectTitle={subjectTitle}
                phase={curriculumSelectionSlugs.phaseSlug}
                phaseTitle={phaseTitle}
              />
            )}
        </OakMaxWidth>
      )}
      <TabContent
        tabSlug={activeTab}
        curriculumSelectionSlugs={curriculumSelectionSlugs}
        curriculumUnitsFormattedData={curriculumUnitsFormattedData}
        curriculumCMSInfo={curriculumCMSInfo}
        curriculumDownloadsTabData={curriculumDownloadsTabData}
        mvRefreshTime={mvRefreshTime}
        filters={filters}
        setFilters={onChangeFilters}
        ks4Options={ks4Options}
        ks4OptionFilterDimensions={ks4OptionFilterDimensions}
      />
    </>
  );
};

const TabContent = ({
  tabSlug,
  curriculumSelectionSlugs,
  curriculumUnitsFormattedData,
  curriculumCMSInfo,
  curriculumDownloadsTabData,
  mvRefreshTime,
  filters,
  setFilters,
  ks4Options,
  ks4OptionFilterDimensions,
}: { tabSlug: TabSlug } & UnitSequenceViewProps & {
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
        ks4OptionFilterDimensions={ks4OptionFilterDimensions}
      />
    );
  } else if (tabSlug === "curriculum-explainer") {
    if (!curriculumCMSInfo) {
      notFound();
    }
    return <ProgrammeOverview curriculumCMSInfo={curriculumCMSInfo} />;
  } else if (tabSlug === "download") {
    return (
      <ProgrammeDownloads
        mvRefreshTime={mvRefreshTime}
        curriculumSelectionSlugs={curriculumSelectionSlugs}
        curriculumDownloadsTabData={curriculumDownloadsTabData}
        curriculumUnitsFormattedData={curriculumUnitsFormattedData}
      />
    );
  }
  return notFound();
};
