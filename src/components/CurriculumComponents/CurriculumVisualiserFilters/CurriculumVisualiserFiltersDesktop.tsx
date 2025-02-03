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
import { getValidSubjectIconName } from "@/utils/getValidSubjectIconName";

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

      <OakHeading tag="h3" $font={"heading-5"} $mb="space-between-m">
        Filter and highlight
      </OakHeading>

      <>
        <OakHeading
          tag="h4"
          id="year-group-label"
          $font={"heading-6"}
          $mb="space-between-s"
        >
          Year group
        </OakHeading>

        <OakRadioGroup
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
          $gap="space-between-ssx"
          $flexDirection="row"
          $flexWrap="wrap"
          aria-labelledby="year-group-label"
          data-testid="year-group-filter-desktop"
        >
          <OakRadioAsButton
            value="all"
            displayValue="All"
            data-testid={"all-years-radio"}
          />
          {yearOptions.map((yearOption) => (
            <OakRadioAsButton
              key={yearOption}
              value={yearOption}
              displayValue={getYearGroupTitle(yearData, yearOption)}
              data-testid={"year-radio"}
            />
          ))}
        </OakRadioGroup>
      </>

      {subjectCategories.length > 0 && (
        <>
          <OakHeading
            id="subject-categories-label"
            tag="h4"
            $font={"heading-6"}
            $mb="space-between-s"
          >
            Category {childSubjects.length > 0 ? "(KS3)" : ""}
          </OakHeading>

          <OakRadioGroup
            name="subject-categories"
            onChange={(e) =>
              setSingleInFilter("subjectCategories", e.target.value)
            }
            value={filters.subjectCategories[0]!}
            $flexDirection="row"
            $flexWrap="wrap"
            $gap="space-between-ssx"
            aria-labelledby="subject-categories-label"
          >
            {subjectCategories.map((subjectCategory) => (
              <OakRadioAsButton
                key={subjectCategory.id}
                value={String(subjectCategory.id)}
                displayValue={subjectCategory.title}
              />
            ))}
          </OakRadioGroup>
        </>
      )}

      {childSubjects.length > 0 && (
        <>
          <OakHeading
            id="child-subjects-label"
            tag="h4"
            $font={"heading-6"}
            $mb="space-between-s"
          >
            Exam subject (KS4)
          </OakHeading>
          <OakRadioGroup
            name="childSubjects"
            onChange={(e) => setSingleInFilter("childSubjects", e.target.value)}
            value={filters.childSubjects[0]!}
            $flexDirection="row"
            $flexWrap="wrap"
            $gap="space-between-ssx"
            aria-labelledby="child-subjects-label"
          >
            {childSubjects.map((childSubject) => (
              <OakRadioAsButton
                key={childSubject.subject_slug}
                value={childSubject.subject_slug}
                displayValue={childSubject.subject}
                icon={getValidSubjectIconName(childSubject.subject_slug)}
              />
            ))}
          </OakRadioGroup>
        </>
      )}

      {tiers.length > 0 && (
        <>
          <OakHeading
            id="tiers-label"
            tag="h4"
            $font={"heading-6"}
            $mb="space-between-s"
          >
            Learning tier (KS4)
          </OakHeading>
          <OakRadioGroup
            name="tiers"
            onChange={(e) => setSingleInFilter("tiers", e.target.value)}
            value={filters.tiers[0]!}
            $flexDirection="row"
            $flexWrap="wrap"
            $gap="space-between-ssx"
            aria-labelledby="tiers-label"
          >
            {tiers.map((tier) => (
              <OakRadioAsButton
                key={tier.tier_slug}
                value={tier.tier_slug}
                displayValue={tier.tier}
              />
            ))}
          </OakRadioGroup>
        </>
      )}

      <Fieldset data-testid={"threads-filter-desktop"}>
        <FieldsetLegend $font={"heading-6"} $mt="space-between-m2">
          Highlight a thread
        </FieldsetLegend>
        <RadioGroup
          name="thread"
          onChange={(e) =>
            onChangeFilters({ ...filters, threads: [e.target.value] })
          }
          value={filters.threads[0] ?? ""}
        >
          <Box $mt={6} $mb={16} $pl={12} $bl={1} $borderColor="transparent">
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
                $borderColor={isSelected ? "black" : "grey50"}
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
                    {isSelected && (
                      <>
                        <br />
                        {highlightedCount}
                        {highlightedCount === 1 ? " unit " : " units "}
                        highlighted
                      </>
                    )}
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
