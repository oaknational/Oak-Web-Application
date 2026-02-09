import { OakGrid, OakGridArea, OakP } from "@oaknational/oak-components";

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
        onClick={() => onClick(unit, isHighlighted)}
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
          lessonCount={unit.lessons?.length}
          saveProps={{
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
          }}
          index={index + 1}
        />
      </OakGridArea>
    );
  }

  return (
    <OakGrid
      as="ol"
      $cg={"spacing-16"}
      $rg={"spacing-16"}
      $pa={"spacing-0"}
      $pt="spacing-12"
    >
      {units.length < 1 && (
        <OakP>
          {getSubjectCategoryMessage(yearData, year, filters.subjectCategories)}
        </OakP>
      )}
      {units.map((unit, index) => getItems(unit, index))}
    </OakGrid>
  );
}

// TODO: This should be coming from the backend, but I can't find the correct field in the schema.
// for the overview page this seems to come from `keystage_description` and goes through some
// indirect post processing to get the final title. It seems this field is overloaded with
// non key stage titles, so we may need to be able to handle all of them.
// I.e. "Early Years Foundation stage" | "Specialist" | "Therapies"
function getKeyStageTitle(ksSlug: string) {
  switch (ksSlug) {
    case "ks1":
      return "Key stage 1";
    case "ks2":
      return "Key stage 2";
    case "ks3":
      return "Key stage 3";
    case "ks4":
      return "Key stage 4";
  }
}
