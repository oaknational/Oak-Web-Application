import {
  OakGrid,
  OakGridArea,
  OakP,
  useMediaQuery,
} from "@oaknational/oak-components";
import { memo, useCallback } from "react";

import { getTagsForUnitCard } from "./getTagsForUnitCard";
import { getSavePropsForUnitCard } from "./getSavePropsForUnitCard";

import { isHighlightedUnit } from "@/utils/curriculum/filtering";
import { CurriculumFilters, Unit, YearData } from "@/utils/curriculum/types";
import {
  getKeyStageTitle,
  getSubjectCategoryMessage,
} from "@/utils/curriculum/formatting";
import { resolveOakHref } from "@/common-lib/urls";
import { createTeacherProgrammeSlug } from "@/utils/curriculum/slugs";
import CardListing, {
  CardProps,
} from "@/components/TeacherComponents/CardListing/CardListing";
import { useTeacherBrowseAnalytics } from "@/context/TeacherBrowseAnalytics/TeacherBrowseAnalyticsProvider";

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
  const unitAccessed = useTeacherBrowseAnalytics(
    (store) => store.track.unitAccessed,
  );
  const isMobile = useMediaQuery("mobile");

  const onClick = useCallback(
    (unit: Unit) => {
      unitAccessed({
        componentType: "unit_info_button",
        unitContext: {
          unitName: unit.title,
          unitSlug: unit.slug,
          subjectTitle: unit.subject,
          subjectSlug: unit.subject_slug,
          yearGroupName: `Year ${unit.year}`,
          yearGroupSlug: `year-${unit.year}`,
          keyStageSlug: unit.keystage_slug,
          keyStageTitle: getKeyStageTitle(unit.keystage_slug),
          tierName: unit.tier ?? undefined,
          examBoard: unit.examboard ?? undefined,
          pathway: unit.pathway ?? undefined,
        },
      });
    },
    [unitAccessed],
  );

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
      {units.map((unit, index) => {
        const programmeSlug = createTeacherProgrammeSlug(
          unit,
          unit.examboard_slug,
          unit.tier_slug,
          unit.pathway_slug,
        );
        const unitKey = `${programmeSlug}/${unit.slug}`;

        return (
          <ProgrammeUnitCard
            key={unitKey}
            unit={unit}
            programmeSlug={programmeSlug}
            index={index + 1}
            isMobile={isMobile}
            isHighlighted={isHighlightedUnit(unit, filters.threads)}
            onClick={onClick}
          />
        );
      })}
    </OakGrid>
  );
}

type ProgrammeUnitCardProps = {
  unit: Unit;
  programmeSlug: string;
  index: number;
  isMobile: boolean;
  isHighlighted: boolean;
  onClick: (unit: Unit) => void;
};

const ProgrammeUnitCard = memo(function ProgrammeUnitCard({
  unit,
  programmeSlug,
  index,
  isMobile,
  isHighlighted,
  onClick,
}: Readonly<ProgrammeUnitCardProps>) {
  const isOptionalityUnitCard = !!unit.unit_options.length;

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
            onClickLink: () => onClick(unit),
            lessonCount: option.lessons.length,
          }) satisfies CardProps,
      )
    : undefined;

  return (
    <OakGridArea
      $colSpan={[12, isOptionalityUnitCard ? 12 : 4]}
      $minHeight="spacing-180"
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
        onClickLink={() => onClick(unit)}
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
        index={index}
        childCards={childCards}
      />
    </OakGridArea>
  );
});
