"use client";

import { getSeoProps } from "@/browser-lib/seo/getSeoProps";
import CurriculumHeader from "@/components/CurriculumComponents/CurriculumHeader";
import { buildCurriculumMetadata } from "@/components/CurriculumComponents/helpers/curriculumMetadata";
import UnitsTab from "@/components/CurriculumComponents/UnitsTab";
import AppLayout from "@/components/SharedComponents/AppLayout";
import {
  CurriculumInfoPageProps,
  CurriculumTab,
  CurriculumUnitsTrackingData,
} from "@/pages-helpers/curriculum/docx/tab-helpers";
import { getDefaultFilter, useFilters } from "@/utils/curriculum/filtering";
import { CurriculumFilters } from "@/utils/curriculum/types";
import { OakBox } from "@oaknational/oak-components";
import { uniq } from "lodash";
import { usePathname, useSearchParams } from "next/navigation";
import { useMemo } from "react";

export const CurriculumVisualiser = ({
  curriculumSelectionSlugs,
  curriculumPhaseOptions,
  curriculumOverviewTabData,
  curriculumOverviewSanityData,
  curriculumUnitsFormattedData,
  mvRefreshTime,
  curriculumDownloadsTabData,
}: CurriculumInfoPageProps) => {
  const searchParams = useSearchParams();
  const path = usePathname();

  // const [tab, ...slugs] = searchParams?.get("slugs") as CurriculumTab;
  // const basePath = !path ? "" : path.replace(slugs.join("/"), "");
  const { tiers, child_subjects } = curriculumDownloadsTabData;
  const { subjectSlug, ks4OptionSlug, phaseSlug } = curriculumSelectionSlugs;

  const ks4Options =
    curriculumPhaseOptions.subjects.find((s) => s.slug === subjectSlug)!
      .ks4_options ?? [];
  const ks4Option = ks4Options.find((ks4opt) => ks4opt.slug === ks4OptionSlug);

  // TODO: [spike] tracking
  const curriculumUnitsTrackingData: CurriculumUnitsTrackingData = {
    subjectSlug,
    phaseSlug,
    subjectTitle: curriculumOverviewTabData.subjectTitle,
    ks4OptionSlug: ks4Option?.slug,
    ks4OptionTitle: ks4Option?.title,
  };

  const keyStages = uniq(
    Object.values(curriculumUnitsFormattedData.yearData).flatMap(({ units }) =>
      units.map((unit) => unit.keystage_slug),
    ),
  );

  const defaultFilter = useMemo(() => {
    return getDefaultFilter(curriculumUnitsFormattedData);
  }, [curriculumUnitsFormattedData]);

  const [filters, setFilters] = useFilters(defaultFilter);

  //   const { track } = useAnalytics();
  //   const { analyticsUseCase } = useAnalyticsPageProps();

  const onChangeFilters = (newFilters: CurriculumFilters) => {
    setFilters(newFilters);

    // const analyticsData = buildUnitSequenceRefinedAnalytics(
    //   analyticsUseCase,
    //   curriculumUnitsTrackingData,
    //   newFilters,
    // );

    // track.unitSequenceRefined(analyticsData);
  };
  const selectedUnitSlug = "units";

  return (
    <AppLayout
      seoProps={{
        ...getSeoProps({
          title: buildCurriculumMetadata({
            metadataType: "title",
            subjectSlug: subjectSlug,
            subjectTitle: curriculumUnitsTrackingData.subjectTitle,
            ks4OptionSlug: curriculumUnitsTrackingData.ks4OptionSlug,
            ks4OptionTitle: curriculumUnitsTrackingData.ks4OptionTitle,
            keyStages: keyStages,
            tab: "units",
          }),
          description: buildCurriculumMetadata({
            metadataType: "description",
            subjectSlug: subjectSlug,
            subjectTitle: curriculumUnitsTrackingData.subjectTitle,
            ks4OptionSlug: curriculumUnitsTrackingData.ks4OptionSlug,
            ks4OptionTitle: curriculumUnitsTrackingData.ks4OptionTitle,
            keyStages: keyStages,
            tab: "units",
          }),
        }),
        // TODO: [spike] additional seo
      }}
      $background={"white"}
      skipLinkHref={"#curriculum-units"} // TODO: [spike] tabs
    >
      <CurriculumHeader
        tab={"units"} // TODO: [spike] tabs
        curriculumPhaseOptions={curriculumPhaseOptions}
        curriculumSelectionSlugs={curriculumSelectionSlugs}
        keyStages={keyStages}
        color1="mint"
        color2="mint"
      />

      <OakBox $background={"white"}>
        <UnitsTab
          basePath={""}
          selectedUnitSlug={selectedUnitSlug}
          formattedData={curriculumUnitsFormattedData}
          trackingData={curriculumUnitsTrackingData}
          filters={filters}
          onChangeFilters={onChangeFilters}
          slugs={curriculumSelectionSlugs}
          ks4Options={ks4Options}
          curriculumSeoText={
            curriculumOverviewSanityData.curriculumSeoTextRaw || undefined
          }
          curriculumPhaseOptions={curriculumPhaseOptions}
        />
      </OakBox>
    </AppLayout>
  );
};
