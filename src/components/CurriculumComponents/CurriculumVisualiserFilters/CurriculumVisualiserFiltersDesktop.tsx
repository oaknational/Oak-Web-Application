import {
  OakSpan,
  OakBox,
  OakHeading,
  OakRadioGroup,
  OakRadioAsButton,
} from "@oaknational/oak-components";
import { isEqual } from "lodash";

import { Fieldset, FieldsetLegend } from "../OakComponentsKitchen/Fieldset";
import { RadioGroup, RadioButton } from "../OakComponentsKitchen/SimpleRadio";
import SkipLink from "../OakComponentsKitchen/SkipLink";

import {
  CurriculumFilters,
  CurriculumVisualiserFiltersProps,
} from "./CurriculumVisualiserFilters";
import { highlightedUnitCount } from "./helpers";

import Box from "@/components/SharedComponents/Box";
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

      <h2 id="subject-label">Choose a subject</h2>
      <OakRadioGroup name="test" aria-labelledby="subject-label">
        <OakRadioAsButton value="Option 1" displayValue="Year 1" />
        <OakRadioAsButton value="Option 2" displayValue="Year 2" />
      </OakRadioGroup>

      <OakHeading tag="h3">Filter and highlight</OakHeading>

      <Fieldset>
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
        <Fieldset>
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
            const highlightedCount = highlightedUnitCount();
            // yearData,
            // selectedYear,
            // yearSelection,
            // selectedThread,

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
              </Box>
            );
          })}
        </RadioGroup>
      </Fieldset>
    </OakBox>
  );
}
