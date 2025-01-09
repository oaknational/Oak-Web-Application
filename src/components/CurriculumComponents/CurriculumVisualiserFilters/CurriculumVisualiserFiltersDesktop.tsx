import {
  OakSpan,
  OakSmallSecondaryButton,
  OakFlex,
  OakBox,
  OakHeading,
} from "@oaknational/oak-components";

import { FieldsetLegend } from "../OakComponentsKitchen/Fieldset";
import { RadioGroup, RadioButton } from "../OakComponentsKitchen/SimpleRadio";
import SkipLink from "../OakComponentsKitchen/SkipLink";

import {
  CurriculumFilters,
  CurriculumVisualiserFiltersProps,
} from "./CurriculumVisualiserFilters";

import Box from "@/components/SharedComponents/Box";
import { getYearGroupTitle } from "@/utils/curriculum/formatting";
import {
  Thread,
  Subject,
  SubjectCategory,
  Tier,
} from "@/utils/curriculum/types";
import { CurriculumUnitsFormattedData } from "@/pages-helpers/curriculum/docx/tab-helpers";

function getFilterData(yearData: CurriculumUnitsFormattedData["yearData"]) {
  const units = Object.entries(yearData).flatMap(([, units]) => units);
  const childSubjects = new Map<string, Subject>();
  const subjectCategories = new Map<number, SubjectCategory>();
  const tiers = new Map<string, Tier>();
  units.forEach((u) => {
    u.childSubjects.forEach((childSubject) =>
      childSubjects.set(childSubject.subject_slug, childSubject),
    );
    u.tiers.forEach((tier) => tiers.set(tier.tier_slug, tier));
    u.subjectCategories.forEach((subjectCategory) =>
      subjectCategories.set(subjectCategory.id, subjectCategory),
    );
  });

  return {
    childSubjects: [...childSubjects.values()],
    subjectCategories: [...subjectCategories.values()],
    tiers: [...tiers.values()],
  };
}

export default function CurriculumVisualiserFiltersDesktop({
  filters,
  onChangeFilters,
  data,
}: CurriculumVisualiserFiltersProps) {
  const { yearData, threadOptions, yearOptions } = data;

  const { childSubjects, subjectCategories, tiers } = getFilterData(
    data.yearData,
  );

  function isSelectedThread(thread: Thread) {
    return filters.threads.includes(thread.slug);
  }

  function toggleInArray(array: (string | number)[], target: string | number) {
    let found = false;
    const out = array.filter((item) => {
      if (target === item) {
        found = true;
        return false;
      }
      return true;
    });
    if (!found) out.push(target);
    return out;
  }

  function toggleInFilter(key: keyof CurriculumFilters, target: string) {
    const newValues = toggleInArray(filters[key], target);
    onChangeFilters({ ...filters, [key]: newValues });
  }

  function setSingleInFilter(key: keyof CurriculumFilters, newValue: string) {
    onChangeFilters({ ...filters, [key]: [newValue] });
  }

  function addAllToFilter(key: keyof CurriculumFilters, target: string[]) {
    onChangeFilters({ ...filters, [key]: target });
  }

  function filterIncludes(key: keyof CurriculumFilters, ids: string[]) {
    const filterValues = filters[key];
    return ids.every((id) => {
      return filterValues.includes(id);
    });
  }

  return (
    <OakBox $mr={"space-between-s"}>
      <OakHeading tag="h3">Filter and highlight</OakHeading>

      <OakHeading tag="h4" $mb="space-between-xs">
        Year group
      </OakHeading>
      <OakFlex $flexWrap={"wrap"} $gap={"all-spacing-1"}>
        <OakSmallSecondaryButton
          disabled={filterIncludes("years", yearOptions)}
          onClick={() => addAllToFilter("years", yearOptions)}
        >
          All
        </OakSmallSecondaryButton>
        {yearOptions.map((yearOption) => {
          return (
            <OakSmallSecondaryButton
              iconName={
                filterIncludes("years", [yearOption]) ? "tick" : undefined
              }
              onClick={() => toggleInFilter("years", yearOption)}
            >
              {getYearGroupTitle(yearData, yearOption)}
            </OakSmallSecondaryButton>
          );
        })}
      </OakFlex>

      {subjectCategories.length > 0 && (
        <OakBox>
          <OakHeading tag="h4" $mb="space-between-xs" $mt="space-between-m2">
            Category
          </OakHeading>
          <OakFlex $flexWrap={"wrap"} $gap={"all-spacing-1"}>
            {subjectCategories.map((subjectCategory) => {
              return (
                <OakSmallSecondaryButton
                  iconName={
                    filterIncludes("subjectCategories", [
                      String(subjectCategory.id),
                    ])
                      ? "tick"
                      : undefined
                  }
                  onClick={() =>
                    setSingleInFilter(
                      "subjectCategories",
                      String(subjectCategory.id),
                    )
                  }
                >
                  {subjectCategory.title}
                </OakSmallSecondaryButton>
              );
            })}
          </OakFlex>
        </OakBox>
      )}

      {tiers.length > 0 && (
        <OakBox>
          <OakHeading tag="h4" $mb="space-between-xs" $mt="space-between-m2">
            Learning tier (KS4)
          </OakHeading>
          <OakFlex $flexWrap={"wrap"} $gap={"all-spacing-1"}>
            {tiers.map((tier) => {
              return (
                <OakSmallSecondaryButton
                  iconName={
                    filterIncludes("tiers", [tier.tier_slug])
                      ? "tick"
                      : undefined
                  }
                  onClick={() => setSingleInFilter("tiers", tier.tier_slug)}
                >
                  {tier.tier}
                </OakSmallSecondaryButton>
              );
            })}
          </OakFlex>
        </OakBox>
      )}

      {childSubjects.length > 0 && (
        <OakBox>
          <OakHeading tag="h4" $mb="space-between-xs" $mt="space-between-m2">
            Exam subject (KS4)
          </OakHeading>
          <OakFlex $flexWrap={"wrap"} $gap={"all-spacing-1"}>
            {childSubjects.map((childSubject) => {
              return (
                <OakSmallSecondaryButton
                  iconName={
                    filterIncludes("childSubjects", [childSubject.subject_slug])
                      ? "tick"
                      : undefined
                  }
                  onClick={() =>
                    setSingleInFilter(
                      "childSubjects",
                      childSubject.subject_slug,
                    )
                  }
                >
                  {childSubject.subject}
                </OakSmallSecondaryButton>
              );
            })}
          </OakFlex>
        </OakBox>
      )}

      <FieldsetLegend
        $font={"heading-7"}
        $mb="space-between-xs"
        $mt="space-between-m2"
      >
        Threads
      </FieldsetLegend>
      <RadioGroup
        name="thread"
        onChange={(e) =>
          onChangeFilters({ ...filters, threads: [e.target.value] })
        }
        value={filters.threads[0] ?? ""}
      >
        <SkipLink href="#content">Skip to units</SkipLink>
        <Box $mv={16} $pl={12} $bl={1} $borderColor="transparent">
          <RadioButton
            aria-label={"None highlighted"}
            value={""}
            data-testid={"no-threads-radio"}
          >
            None highlighted
          </RadioButton>
        </Box>
        {threadOptions.map((threadOption) => {
          const isSelected = isSelectedThread(threadOption);
          // const highlightedCount = highlightedUnitCount(
          //   yearData,
          //   selectedYear,
          //   yearSelection,
          //   selectedThread,
          // );

          return (
            <Box
              $ba={1}
              $background={isSelected ? "black" : "white"}
              $borderColor={isSelected ? "black" : "grey40"}
              $borderRadius={4}
              $color={isSelected ? "white" : "black"}
              $font={isSelected ? "heading-light-7" : "body-2"}
              $ph={12}
              $pt={12}
              $mb={8}
              key={threadOption.slug}
            >
              <RadioButton
                aria-label={threadOption.title}
                value={threadOption.slug}
                data-testid={
                  isSelected ? "selected-thread-radio" : "thread-radio"
                }
              >
                <OakSpan>
                  {threadOption.title}
                  {/* <OakSpan>
                    {isSelected && (
                      <>
                        <br />
                        {highlightedCount}
                        {highlightedCount === 1 ? " unit " : " units "}
                        highlighted
                      </>
                    )}
                  </OakSpan> */}
                </OakSpan>
              </RadioButton>
            </Box>
          );
        })}
      </RadioGroup>
    </OakBox>
  );
}
