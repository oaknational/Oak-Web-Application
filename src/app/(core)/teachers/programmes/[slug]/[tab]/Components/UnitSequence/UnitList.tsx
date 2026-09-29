import {
  OakGrid,
  OakGridArea,
  OakP,
  useMediaQuery,
} from "@oaknational/oak-components";

import { getTagsForUnitCard } from "./getTagsForUnitCard";
import { getSavePropsForUnitCard } from "./getSavePropsForUnitCard";

import { isHighlightedUnit } from "@/utils/curriculum/filtering";
import {
  CurriculumFilters,
  Unit,
  YearData,
} from "@/utils/curriculum/types";
import { getSubjectCategoryMessage } from "@/utils/curriculum/formatting";
import { resolveOakHref } from "@/common-lib/urls";
import { createTeacherProgrammeSlug } from "@/utils/curriculum/slugs";
import CardListing, {
  CardProps,
} from "@/components/TeacherComponents/CardListing/CardListing";

type ProgrammeUnitListProps = {
  units: Unit[];
  filters: CurriculumFilters;
  year: string;
  yearData: YearData;
};
export function ProgrammeUnitList({
  units,
  yearData,
  year,
  filters,
}: Readonly<ProgrammeUnitListProps>) {
  const isMobile = useMediaQuery("mobile");

  function getItems(unit: Unit, index: number, isMobile: boolean) {
    const isHighlighted = isHighlightedUnit(unit, filters.threads);
    const isOptionalityUnitCard = !!unit.unit_options.length;

    const programmeSlug = createTeacherProgrammeSlug(
      unit,
      unit.examboard_slug,
      unit.tier_slug,
      unit.pathway_slug,
    );

    const getLayoutVariant = () => {
      const useHorizontalLayout = isOptionalityUnitCard && !isMobile;
      if (useHorizontalLayout) {
        return "horizontal";
      } else {
        return "vertical";
      }
    };

    const childCards = isOptionalityUnitCard
      ? unit.unit_options.map(
          (option) =>
            ({
              highlightColorVariant: isHighlighted ? "secondary" : undefined,
              title: option.title,
              saveProps: getSavePropsForUnitCard({
                slug: option.slug ?? unit.slug,
                title: option.title,
                programmeSlug,
                subject: unit.subject,
                subjectSlug: unit.subject_slug,
                keystageSlug: unit.keystage_slug,
                isOptionalityUnit: false,
              }),
              href: resolveOakHref({
                page: "unit-overview",
                unitSlug: option.slug ?? unit.slug,
                programmeSlug,
              }),
              showBorder: true,
              lessonCount: option.lessons.length,
            }) satisfies CardProps,
        )
      : undefined;

    return (
      <OakGridArea
        $colSpan={[12, isOptionalityUnitCard ? 12 : 4]}
        $minHeight="spacing-180"
        key={`${unit.slug}-${index}`}
        as="li"
      >
        <CardListing
          layoutVariant={getLayoutVariant()}
          title={unit.title}
          highlightColorVariant={isHighlighted ? "secondary" : undefined}
          tags={getTagsForUnitCard(unit)}
          href={resolveOakHref({
            page: "unit-overview",
            unitSlug: unit.slug,
            programmeSlug,
          })}
          lessonCount={isOptionalityUnitCard ? undefined : unit.lessons?.length}
          saveProps={getSavePropsForUnitCard({
            slug: unit.slug,
            title: unit.title,
            programmeSlug,
            subject: unit.subject,
            subjectSlug: unit.subject_slug,
            keystageSlug: unit.keystage_slug,
            isOptionalityUnit: isOptionalityUnitCard,
          })}
          index={index + 1}
          childCards={childCards}
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
      {units.map((unit, index) => getItems(unit, index, isMobile))}
    </OakGrid>
  );
}
