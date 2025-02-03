import { OakSpan, OakBox, OakHeading } from "@oaknational/oak-components";
import { isEqual } from "lodash";

import { Fieldset, FieldsetLegend } from "../OakComponentsKitchen/Fieldset";
import { RadioGroup, RadioButton } from "../OakComponentsKitchen/SimpleRadio";
import SkipLink from "../OakComponentsKitchen/SkipLink";

import {
  CurriculumFilters,
  CurriculumVisualiserFiltersProps,
} from "./CurriculumVisualiserFilters";
import { highlightedUnitCount } from "./helpers";

import { getYearGroupTitle } from "@/utils/curriculum/formatting";
import {
  Thread,
  Subject,
  SubjectCategory,
  Tier,
} from "@/utils/curriculum/types";
import { CurriculumUnitsFormattedData } from "@/pages-helpers/curriculum/docx/tab-helpers";

function getFilterData(
  yearData: CurriculumUnitsFormattedData["yearData"],
  years: string[],
) {
  const childSubjects = new Map<string, Subject>();
  const subjectCategories = new Map<number, SubjectCategory>();
  const tiers = new Map<string, Tier>();
  years.forEach((year) => {
    const obj = yearData[year]!;
    console.log(">>>> HERE", obj, Object.keys(yearData));
    obj.childSubjects.forEach((childSubject) =>
      childSubjects.set(childSubject.subject_slug, childSubject),
    );
    obj.tiers.forEach((tier) => tiers.set(tier.tier_slug, tier));
    obj.subjectCategories.forEach((subjectCategory) =>
      subjectCategories.set(subjectCategory.id, subjectCategory),
    );
  });

  const childSubjectsArray = [...childSubjects.values()];
  const subjectCategoriesArray = [...subjectCategories.values()];
  const tiersArray = [...tiers.values()];

  return {
    childSubjects: childSubjectsArray.length > 1 ? childSubjectsArray : [],
    subjectCategories:
      childSubjectsArray.length < 1 ? subjectCategoriesArray : [],
    tiers: tiersArray,
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
    filters.years,
  );

  console.log({ childSubjects, subjectCategories, tiers });

  function isSelectedThread(thread: Thread) {
    return filters.threads.includes(thread.slug);
  }

  function setSingleInFilter(key: keyof CurriculumFilters, newValue: string) {
    onChangeFilters({ ...filters, [key]: [newValue] });
  }

  function addAllToFilter(key: keyof CurriculumFilters, target: string[]) {
    onChangeFilters({ ...filters, [key]: target });
  }

  return (
    <OakBox $mr={"space-between-s"}>
      <SkipLink href="#content">Skip to units</SkipLink>
      <OakHeading tag="h3">Filter and highlight</OakHeading>

      <Fieldset data-testid="years">
        <FieldsetLegend $font={"heading-7"} $mb="space-between-xs">
          Year group
        </FieldsetLegend>
        <RadioGroup
          name="year"
          onChange={(e) =>
            addAllToFilter(
              "years",
              e.target.value === "all" ? yearOptions : [e.target.value],
            )
          }
          value={
            isEqual(filters.years, yearOptions) ? "all" : filters.years[0]!
          }
        >
          <RadioButton value={"all"}>All</RadioButton>
          {yearOptions.map((yearOption) => {
            return (
              <RadioButton value={yearOption}>
                {getYearGroupTitle(yearData, yearOption)}
              </RadioButton>
            );
          })}
        </RadioGroup>
      </Fieldset>

      {subjectCategories.length > 0 && (
        <Fieldset>
          <FieldsetLegend $font={"heading-7"} $mb="space-between-xs">
            Category {childSubjects.length > 0 ? "(KS3)" : ""}
          </FieldsetLegend>
          <RadioGroup
            name="subjectCategories"
            onChange={(e) =>
              setSingleInFilter("subjectCategories", e.target.value)
            }
            value={filters.subjectCategories[0]!}
          >
            {subjectCategories.map((subjectCategory) => {
              return (
                <RadioButton value={String(subjectCategory.id)}>
                  {subjectCategory.title}
                </RadioButton>
              );
            })}
          </RadioGroup>
        </Fieldset>
      )}

      {tiers.length > 0 && (
        <Fieldset data-testid="tiers">
          <FieldsetLegend $font={"heading-7"} $mb="space-between-xs">
            Learning tier (KS4)
          </FieldsetLegend>
          <RadioGroup
            name="tiers"
            onChange={(e) => setSingleInFilter("tiers", e.target.value)}
            value={filters.tiers[0]!}
          >
            {tiers.map((tier) => {
              return (
                <RadioButton value={tier.tier_slug}>{tier.tier}</RadioButton>
              );
            })}
          </RadioGroup>
        </Fieldset>
      )}

      {childSubjects.length > 0 && (
        <Fieldset>
          <FieldsetLegend $font={"heading-7"} $mb="space-between-xs">
            Exam subject (KS4)
          </FieldsetLegend>
          <RadioGroup
            name="childSubjects"
            onChange={(e) => setSingleInFilter("childSubjects", e.target.value)}
            value={filters.childSubjects[0]!}
          >
            {childSubjects.map((childSubject) => {
              return (
                <RadioButton value={childSubject.subject_slug}>
                  {childSubject.subject}
                </RadioButton>
              );
            })}
          </RadioGroup>
        </Fieldset>
      )}

      <Fieldset>
        <FieldsetLegend
          $font={"heading-7"}
          $mb="space-between-xs"
          $mt="space-between-m2"
        >
          Highlight a thread
        </FieldsetLegend>
        <RadioGroup
          name="thread"
          onChange={(e) =>
            onChangeFilters({ ...filters, threads: [e.target.value] })
          }
          value={filters.threads[0] ?? ""}
        >
          <OakBox
            $mv="space-between-s"
            $pl="inner-padding-s"
            $bl="border-solid-s"
            $borderColor="transparent"
          >
            <RadioButton
              aria-label={"None highlighted"}
              value={""}
              data-testid={"no-threads-radio"}
            >
              None highlighted
            </RadioButton>
          </OakBox>
          {threadOptions.map((threadOption) => {
            const isSelected = isSelectedThread(threadOption);
            const highlightedCount = highlightedUnitCount();
            // yearData,
            // selectedYear,
            // yearSelection,
            // selectedThread,

            return (
              <OakBox
                $ba="border-solid-s"
                $background={isSelected ? "black" : "white"}
                $borderColor={isSelected ? "black" : "grey40"}
                $borderRadius="border-radius-s"
                $color={isSelected ? "white" : "black"}
                $font={isSelected ? "heading-light-7" : "body-2"}
                $ph="inner-padding-s"
                $pt="inner-padding-s"
                $mb="space-between-ssx"
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
                    <OakSpan>
                      {isSelected && (
                        <>
                          <br />
                          {highlightedCount}
                          {highlightedCount === 1 ? " unit " : " units "}
                          highlighted
                        </>
                      )}
                    </OakSpan>
                  </OakSpan>
                </RadioButton>
              </OakBox>
            );
          })}
        </RadioGroup>
      </Fieldset>
    </OakBox>
  );
}
