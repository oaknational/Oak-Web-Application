import { join } from "path";

import React, { FC, useState, useRef } from "react";
import { VisuallyHidden } from "react-aria";
import { OakGridArea, OakHeading, OakFlex } from "@oaknational/oak-components";
import Link from "next/link";
import { useRouter } from "next/router";
import { useSearchParams } from "next/navigation";

import { createProgrammeSlug } from "../UnitsTab/UnitsTab";

import Box from "@/components/SharedComponents/Box";
import Card from "@/components/SharedComponents/Card/Card";
import { CurriculumUnitsTabData } from "@/node-lib/curriculum-api-2023";
import OutlineHeading from "@/components/SharedComponents/OutlineHeading/OutlineHeading";
import Button from "@/components/SharedComponents/Button/Button";
import BrushBorders from "@/components/SharedComponents/SpriteSheet/BrushSvgs/BrushBorders/BrushBorders";
import UnitModal, {
  Lesson,
} from "@/components/CurriculumComponents/UnitModal/UnitModal";
import { TagFunctional } from "@/components/SharedComponents/TagFunctional";
import UnitsTabSidebar from "@/components/CurriculumComponents/UnitsTabSidebar";
import AnchorTarget from "@/components/SharedComponents/AnchorTarget";

export type YearData = {
  [key: string]: {
    units: Unit[];
    childSubjects: Subject[];
    domains: Domain[];
    tiers: Tier[];
    disciplines: Discipline[];
  };
};

export type Unit = CurriculumUnitsTabData["units"][number];

export interface Thread {
  title: string;
  slug: string;
  order: number;
}

export interface Subject {
  subject: string;
  subject_slug: string;
}

export interface Domain {
  domain: string;
  domain_id: number;
}

export interface Discipline {
  id: number;
  title: string;
}

export interface Tier {
  tier: string;
  tier_slug: string;
}

export interface Filter {
  discipline_id?: Discipline["id"] | null;
  subject_slug?: Subject["subject_slug"] | null;
  domain_id?: Domain["domain_id"] | null;
  tier_slug?: Tier["tier_slug"] | null;
  year: string;
  thread_slug?: string | null;
}

type CurriculumVisualiserProps = {
  unitData: Unit | null;
  filter: Filter;
  selectedThread: Thread | null;
  selectedYear: string | null;
  examboardSlug: string | null;
  yearData: YearData;
  handleSelectDomain: (year: string, domain: Domain) => void;
  handleSelectSubject: (year: string, subject: Subject) => void;
  handleSelectTier: (year: string, tier: Tier) => void;
  handleSelectDiscipline: (year: string, discipline: Discipline) => void;
  mobileHeaderScrollOffset?: number;
  selectedUnit?: string;
  basePath: string;
};

function dedupUnits(units: Unit[]) {
  const unitLookup = new Set();
  return units.filter((unit) => {
    if (!unitLookup.has(unit.slug)) {
      unitLookup.add(unit.slug);
      return true;
    }
    return false;
  });
}

export function isVisibleUnit(filter: Filter, unit: Unit) {
  const s = filter;
  if (!s) {
    return false;
  }
  const filterBySubject =
    !s.subject_slug || s.subject_slug === unit.subject_slug;
  const filterByDiscipline =
    !s.discipline_id ||
    unit.tags?.findIndex((tag) => tag.id === s.discipline_id) !== -1;
  const filterByDomain =
    !s.domain_id || s.domain_id === 0 || s.domain_id === unit.domain_id;
  const filterByTier = !unit.tier_slug || s.tier_slug === unit.tier_slug;

  // Look for duplicates that don't have an examboard, tier or subject parent
  // (i.e. aren't handled by other filters)

  return (
    filterBySubject && filterByDomain && filterByTier && filterByDiscipline
  );
}

function isSelectedDomain(filter: Filter, domain: Domain) {
  return filter.domain_id === domain.domain_id;
}

function isSelectedSubject(filter: Filter, subject: Subject) {
  return filter.subject_slug === subject.subject_slug;
}

function isSelectedTier(filter: Filter, tier: Tier) {
  return filter.tier_slug === tier.tier_slug;
}

function isSelectedDiscipline(filter: Filter, discipline: Discipline) {
  return filter.discipline_id === discipline.id;
}

function isHighlightedUnit(unit: Unit, selectedThread: Thread | null) {
  if (!selectedThread) {
    return false;
  }
  return unit.threads.some((t) => t.slug === selectedThread.slug);
}

function sortChildSubjects(subjects: Subject[]) {
  return [...subjects].sort((a, b) => {
    // Special logic we always want combined-science first.
    if (a.subject_slug === "combined-science") return -10;
    if (b.subject_slug === "combined-science") return 10;

    // Alphabetical
    if (a.subject_slug < b.subject_slug) return -1;
    if (a.subject_slug > b.subject_slug) return 1;
    return 0;
  });
}

// Function component

const CurriculumVisualiser: FC<CurriculumVisualiserProps> = ({
  filter,
  selectedYear,
  examboardSlug,
  yearData,
  handleSelectDomain,
  handleSelectSubject,
  handleSelectTier,
  handleSelectDiscipline,
  mobileHeaderScrollOffset,
  selectedThread,
  selectedUnit,
  basePath,
}) => {
  // Selection state helpers
  const [currentUnitLessons, setCurrentUnitLessons] = useState<Lesson[]>([]);
  const [unitVariantID, setUnitVariantID] = useState<number | null>(null);
  const itemEls = useRef<(HTMLDivElement | null)[]>([]);
  const visualiserRef = useRef<HTMLDivElement>(null);
  const searchParams = useSearchParams();

  const units = Object.values(yearData).flatMap((obj) => obj.units);
  const selectedUnitData = units.find((unit) => unit.slug === selectedUnit);

  const router = useRouter();

  const handleCloseModal = () => {
    router.push(basePath, undefined, { scroll: false });
  };

  return (
    <OakGridArea
      id="content"
      $colSpan={[12, 9]}
      data-testid="curriculum-visualiser"
      ref={visualiserRef}
    >
      {yearData &&
        Object.keys(yearData)
          .filter((year) => !selectedYear || selectedYear === year)
          .map((year, index) => {
            const { units, childSubjects, domains, tiers, disciplines } =
              yearData[year] as YearData[string];

            const ref = (element: HTMLDivElement) => {
              itemEls.current[index] = element;
            };
            const filteredUnits = units.filter((unit: Unit) => {
              return isVisibleUnit(filter, unit);
            });
            const dedupedUnits = dedupUnits(filteredUnits);

            return (
              <Box
                key={year}
                $background={"pink30"}
                $pt={32}
                $position={"relative"}
                $pl={30}
                $mb={32}
                $borderRadius={4}
                className="mobileYearDisplay"
                id={year}
                ref={ref}
              >
                <AnchorTarget
                  $paddingTop={mobileHeaderScrollOffset}
                  id={`year-${year}`}
                />

                <OakHeading
                  tag="h3"
                  $font={["heading-6", "heading-5"]}
                  $mb="space-between-m2"
                  data-testid="year-heading"
                >
                  Year {year}
                </OakHeading>
                {disciplines?.length > 1 && (
                  <Box role="group" aria-label="Disciplines">
                    {disciplines.map((discipline, index) => {
                      const isSelected = isSelectedDiscipline(
                        filter,
                        discipline,
                      );

                      return (
                        <Button
                          $mb={20}
                          $mr={20}
                          background={isSelected ? "black" : "white"}
                          key={index}
                          label={discipline.title}
                          onClick={() =>
                            handleSelectDiscipline(year, discipline)
                          }
                          size="small"
                          data-testid="discipline-button"
                          aria-pressed={isSelected}
                        />
                      );
                    })}
                  </Box>
                )}
                {childSubjects.length > 0 && (
                  <Box role="group" aria-label="Child Subjects">
                    {sortChildSubjects(childSubjects).map(
                      (subject: Subject) => {
                        const isSelected = isSelectedSubject(filter, subject);

                        return (
                          <Button
                            $mb={20}
                            $mr={20}
                            background={isSelected ? "black" : "white"}
                            key={subject.subject_slug}
                            label={subject.subject}
                            onClick={() => handleSelectSubject(year, subject)}
                            size="small"
                            data-testid="subject-button"
                            aria-pressed={isSelected}
                          />
                        );
                      },
                    )}
                  </Box>
                )}
                {domains.length > 0 && (
                  <Box role="group" aria-label="Domains">
                    {domains.map((domain: Domain) => {
                      const isSelected = isSelectedDomain(filter, domain);

                      return (
                        <Button
                          $mb={20}
                          $mr={20}
                          background={isSelected ? "black" : "white"}
                          key={domain.domain_id}
                          label={domain.domain}
                          onClick={() => handleSelectDomain(year, domain)}
                          size="small"
                          data-testid="domain-button"
                          aria-pressed={isSelected}
                        />
                      );
                    })}
                  </Box>
                )}
                {tiers.length > 0 && (
                  <Box role="group" aria-label="Tiers">
                    {tiers.map((tier: Tier) => {
                      const isSelected = isSelectedTier(filter, tier);
                      return (
                        <Button
                          $font={"heading-6"}
                          $mb={20}
                          $mr={24}
                          key={tier.tier_slug}
                          label={tier.tier}
                          onClick={() => handleSelectTier(year, tier)}
                          size="small"
                          variant="minimal"
                          isCurrent={isSelected}
                          currentStyles={["underline"]}
                          data-testid={`tier-button`}
                          aria-pressed={isSelected}
                        />
                      );
                    })}
                  </Box>
                )}
                <OakFlex
                  $flexWrap={"wrap"}
                  $mt="space-between-xs"
                  data-testid="unit-cards"
                >
                  {dedupedUnits.map((unit: Unit, index: number) => {
                    const isHighlighted = isHighlightedUnit(
                      unit,
                      selectedThread,
                    );

                    const unitUrl =
                      join(basePath, unit.slug) + `?${searchParams.toString()}`;

                    return (
                      <Card
                        key={unit.slug + index}
                        $background={isHighlighted ? "black" : "white"}
                        $color={isHighlighted ? "white" : "black"}
                        $flexGrow={"unset"}
                        $mb={32}
                        $mr={28}
                        $position={"relative"}
                        $width={[
                          "100%",
                          "calc(50% - 28px)",
                          "calc(33% - 26px)",
                        ]}
                        data-testid={
                          isHighlighted ? "highlighted-unit-card" : "unit-card"
                        }
                        $justifyContent={"space-between"}
                      >
                        <Box>
                          <OutlineHeading
                            tag={"div"}
                            $font={"heading-5"}
                            $fontSize={24}
                            $mb={12}
                          >
                            {index + 1}
                          </OutlineHeading>
                          <Link href={unitUrl} scroll={false}>
                            {isHighlighted && (
                              <VisuallyHidden>
                                Highlighted:&nbsp;
                              </VisuallyHidden>
                            )}
                            {unit.title}
                          </Link>
                          {unit.unit_options.length > 1 && (
                            <Box
                              $mt={12}
                              $mb={20}
                              $zIndex={"neutral"}
                              data-testid="options-tag"
                              $position={"relative"}
                            >
                              <TagFunctional
                                color="lavender"
                                text={`${unit.unit_options.length} unit options`}
                              />
                            </Box>
                          )}
                          <BrushBorders
                            color={isHighlighted ? "black" : "white"}
                          />
                        </Box>

                        <OakFlex
                          $flexDirection={"row"}
                          $justifyContent={"flex-end"}
                        >
                          <Link href={unitUrl} scroll={false}>
                            Unit info
                          </Link>
                        </OakFlex>
                      </Card>
                    );
                  })}
                </OakFlex>
              </Box>
            );
          })}
      {selectedUnitData && (
        <UnitsTabSidebar
          displayModal={!!selectedUnitData}
          onClose={handleCloseModal}
          lessons={currentUnitLessons}
          programmeSlug={createProgrammeSlug(
            selectedUnitData,
            examboardSlug,
            filter.tier_slug ?? undefined,
          )}
          unitOptionsAvailable={
            (selectedUnitData?.unit_options ?? []).length > 0
          }
          unitSlug={selectedUnitData?.slug}
          unitVariantID={unitVariantID}
        >
          <UnitModal
            setCurrentUnitLessons={setCurrentUnitLessons}
            setUnitVariantID={setUnitVariantID}
            unitData={selectedUnitData}
            displayModal={!!selectedUnitData}
            setUnitOptionsAvailable={() => {}}
            unitOptionsAvailable={
              (selectedUnitData?.unit_options ?? []).length > 0
            }
            isHighlighted={
              selectedUnitData
                ? isHighlightedUnit(selectedUnitData, selectedThread)
                : false
            }
          />
        </UnitsTabSidebar>
      )}
    </OakGridArea>
  );
};
export default CurriculumVisualiser;
