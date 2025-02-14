import {
  OakSpan,
  OakBox,
  OakHeading,
  OakRadioGroup,
  OakRadioAsButton,
  OakHandDrawnHR,
} from "@oaknational/oak-components";
import { isEqual } from "lodash";

import { Fieldset, FieldsetLegend } from "../OakComponentsKitchen/Fieldset";
import { RadioGroup, RadioButton } from "../OakComponentsKitchen/SimpleRadio";
import SkipLink from "../OakComponentsKitchen/SkipLink";

import { CurriculumVisualiserFiltersProps } from "./CurriculumVisualiserFilters";
import { highlightedUnitCount } from "./helpers";

import { getValidSubjectCategoryIconById } from "@/utils/getValidSubjectCategoryIconById";
import { getYearGroupTitle } from "@/utils/curriculum/formatting";
import { Thread, CurriculumFilters } from "@/utils/curriculum/types";
import { getValidSubjectIconName } from "@/utils/getValidSubjectIconName";
import { getFilterData } from "@/utils/curriculum/filtering";
import {
  byKeyStageSlug,
  presentAtKeyStageSlugs,
} from "@/utils/curriculum/keystage";

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

  const keyStageSlugData = byKeyStageSlug(yearData);
  const childSubjectsAt = presentAtKeyStageSlugs(
    keyStageSlugData,
    "childSubjects",
    filters.years,
  );
  const subjectCategoriesAt = presentAtKeyStageSlugs(
    keyStageSlugData,
    "subjectCategories",
    filters.years,
  ).filter((ks) => !childSubjectsAt.includes(ks));
  const tiersAt = presentAtKeyStageSlugs(keyStageSlugData, "tiers");

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

      {subjectCategoriesAt.length > 0 && (
        <>
          <OakHandDrawnHR
            hrColor={"grey40"}
            $mt={"space-between-m"}
            $mb={"space-between-m2"}
          />
          <OakHeading
            id="subject-categories-label"
            tag="h4"
            $font={"heading-6"}
            $mb="space-between-s"
          >
            Category{" "}
            {subjectCategoriesAt.length === 1
              ? `(${subjectCategoriesAt[0]?.toUpperCase()})`
              : ""}
          </OakHeading>

          <OakRadioGroup
            name="subject-categories"
            onChange={(e) =>
              setSingleInFilter("subjectCategories", e.target.value)
            }
            value={String(filters.subjectCategories[0]!)}
            $flexDirection="row"
            $flexWrap="wrap"
            $gap="space-between-ssx"
            aria-labelledby="subject-categories-label"
          >
            {subjectCategories.map((subjectCategory) => {
              return (
                <OakRadioAsButton
                  key={subjectCategory.id}
                  value={String(subjectCategory.id)}
                  displayValue={subjectCategory.title}
                  icon={getValidSubjectCategoryIconById(subjectCategory.id)}
                />
              );
            })}
          </OakRadioGroup>
        </>
      )}

      {childSubjects.length > 0 && (
        <>
          <OakHandDrawnHR
            hrColor={"grey40"}
            $mt={"space-between-m"}
            $mb={"space-between-m2"}
          />

          <OakHeading
            id="child-subjects-label"
            tag="h4"
            $font={"heading-6"}
            $mb="space-between-s"
          >
            Exam subject{" "}
            {childSubjectsAt.length === 1
              ? `(${childSubjectsAt[0]?.toUpperCase()})`
              : ""}
          </OakHeading>
          <OakRadioGroup
            name="childSubjects"
            onChange={(e) => setSingleInFilter("childSubjects", e.target.value)}
            value={String(filters.childSubjects[0]!)}
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
          <OakHandDrawnHR
            hrColor={"grey40"}
            $mt={"space-between-m"}
            $mb={"space-between-m2"}
          />

          <OakHeading
            id="tiers-label"
            tag="h4"
            $font={"heading-6"}
            $mb="space-between-s"
          >
            Learning tier{" "}
            {tiersAt.length === 1 ? `(${tiersAt[0]?.toUpperCase()})` : ""}
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

      <OakHandDrawnHR
        hrColor={"grey40"}
        $mt={"space-between-m"}
        $mb={"space-between-m2"}
      />
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
            const highlightedCount = highlightedUnitCount(
              yearData,
              filters,
              filters.threads,
            );

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
              </OakBox>
            );
          })}
        </RadioGroup>
      </Fieldset>
    </OakBox>
  );
}
