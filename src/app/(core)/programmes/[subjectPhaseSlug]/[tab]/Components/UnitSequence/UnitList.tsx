import { OakGrid, OakGridArea, OakP } from "@oaknational/oak-components";
import { keystageSlugs } from "@oaknational/oak-curriculum-schema";
import z from "zod";
import { useUser } from "@clerk/nextjs";

import { isHighlightedUnit } from "@/utils/curriculum/filteringApp";
import {
  CurriculumFilters,
  Thread,
  Unit,
  YearData,
} from "@/utils/curriculum/types";
import { getSubjectCategoryMessage } from "@/utils/curriculum/formatting";
import { resolveOakHref } from "@/common-lib/urls";
import { createTeacherProgrammeSlug } from "@/utils/curriculum/slugs";
import useAnalytics from "@/context/Analytics/useAnalytics";
import useAnalyticsPageProps from "@/hooks/useAnalyticsPageProps";
import { buildUnitOverviewAccessedAnalytics } from "@/utils/curriculum/analytics";
import CardListing from "@/components/TeacherComponents/CardListing/CardListing";
import type { KeyStageTitleValueType } from "@/browser-lib/avo/Avo";

type KeystageSlug = z.infer<typeof keystageSlugs>;

type ProgrammeUnitListProps = {
  units: Unit[];
  filters: CurriculumFilters;
  year: string;
  yearData: YearData;
  selectedThread?: Thread;
};
export function ProgrammeUnitList({
  units,
  yearData,
  year,
  filters,
  selectedThread,
}: Readonly<ProgrammeUnitListProps>) {
  const { track } = useAnalytics();
  const { isSignedIn } = useUser();
  const { analyticsUseCase } = useAnalyticsPageProps();

  const onClick = (unit: Unit, isHighlighted: boolean) => {
    track.unitOverviewAccessed(
      buildUnitOverviewAccessedAnalytics({
        unit,
        isHighlighted,
        componentType: "unit_info_button",
        selectedThread,
        analyticsUseCase,
      }),
    );
  };

  function getItems(unit: Unit, index: number) {
    const isHighlighted = isHighlightedUnit(unit, filters.threads);

    return (
      <OakGridArea
        $colSpan={[12, 4]}
        $minHeight="spacing-180"
        key={`${unit.slug}-${index}`}
        as="li"
      >
        <CardListing
          layoutVariant="vertical"
          title={unit.title}
          isHighlighted={isHighlighted}
          // TD: [integrated journey] optionality units
          href={resolveOakHref({
            page: "lesson-index",
            unitSlug: unit.slug,
            programmeSlug: createTeacherProgrammeSlug(unit),
          })}
          onClickLink={() => onClick(unit, isHighlighted)}
          lessonCount={unit.lessons?.length}
          saveProps={
            isSignedIn
              ? {
                  unitSlug: unit.slug,
                  unitTitle: unit.title,
                  programmeSlug: createTeacherProgrammeSlug(unit),
                  trackingProps: {
                    savedFrom: "unit_listing_save_button",
                    keyStageSlug: unit.keystage_slug,
                    keyStageTitle: getKeyStageTitle(unit.keystage_slug),
                    subjectTitle: unit.subject,
                    subjectSlug: unit.subject_slug,
                  },
                }
              : undefined
          }
          index={index + 1}
        />
      </OakGridArea>
    );
  }

  if (units.length < 1) {
    return (
      <OakP>
        {getSubjectCategoryMessage(yearData, year, filters.subjectCategories)}
      </OakP>
    );
  }

  return (
    <OakGrid
      as="ol"
      $cg={"spacing-16"}
      $rg={"spacing-16"}
      $pa={"spacing-0"}
      $mv={"spacing-0"}
    >
      {units.map((unit, index) => getItems(unit, index))}
    </OakGrid>
  );
}

// Types are loose coming out of the API so we cast to `KeystageSlug` to
// do our best to map it to the correct title. Fallback to undefined if we can't map it.
export function getKeyStageTitle(
  ksSlug: string,
): KeyStageTitleValueType | undefined {
  switch (ksSlug as KeystageSlug) {
    case "ks1":
      return "Key stage 1";
    case "ks2":
      return "Key stage 2";
    case "ks3":
      return "Key stage 3";
    case "ks4":
      return "Key stage 4";
    case "early-years-foundation-stage":
      return "Early Years Foundation stage";
    default:
      return undefined;
  }
}
