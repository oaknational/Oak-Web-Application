import {
  OakRadioGroup,
  OakRadioAsButton,
  OakBox,
  OakP,
} from "@oaknational/oak-components";
import { useMemo, useId } from "react";

import { getValidSubjectCategoryIconById } from "@/utils/getValidSubjectCategoryIconById";
import { CurriculumFilters } from "@/utils/curriculum/types";
import {
  getFilterData,
  scopeYearsToKeystageFilter,
} from "@/utils/curriculum/filtersUrl";
import {
  byKeyStageSlug,
  presentAtKeyStageSlugs,
} from "@/utils/curriculum/keystage";
import { CurriculumUnitsFormattedData } from "@/pages-helpers/curriculum/docx/tab-helpers";
import { CurriculumSelectionSlugs } from "@/utils/curriculum/slugs";
import { ComponentTypeValueType } from "@/browser-lib/avo/Avo";

export type CurricFiltersSubjectCategoriesProps = {
  filters: CurriculumFilters;
  onChangeFilters: (
    newFilters: CurriculumFilters,
    source: ComponentTypeValueType,
  ) => void;
  data: CurriculumUnitsFormattedData;
  slugs: CurriculumSelectionSlugs;
  // The context prop can be removed once the integrated journey is fully launched
  context: "curriculum-visualiser" | "integrated-journey";
};

export function CurricFiltersSubjectCategories({
  filters,
  onChangeFilters,
  data,
  slugs,
  context,
}: Readonly<CurricFiltersSubjectCategoriesProps>) {
  const id = useId();
  const { yearData } = data;

  const effectiveYears = scopeYearsToKeystageFilter(filters);

  const { subjectCategories } = getFilterData(data.yearData, effectiveYears);

  const keyStageSlugData = byKeyStageSlug(yearData);
  const childSubjectsAt = presentAtKeyStageSlugs(
    keyStageSlugData,
    "childSubjects",
    effectiveYears,
  );
  const subjectCategoriesAt = presentAtKeyStageSlugs(
    keyStageSlugData,
    "subjectCategories",
    effectiveYears,
  ).filter((ks) => !childSubjectsAt.includes(ks));

  function setSingleInFilter(key: keyof CurriculumFilters, newValue: string) {
    onChangeFilters(
      { ...filters, [key]: [newValue] },
      "subject_category_button",
    );
  }

  const subjectCategoryIdAsString = useMemo(() => {
    return String(filters.subjectCategories[0]);
  }, [filters.subjectCategories]);

  return (
    <>
      {subjectCategoriesAt.length > 0 && (
        <OakBox>
          <OakRadioGroup
            name={"subject-categories_" + id}
            onChange={(e) =>
              setSingleInFilter("subjectCategories", e.target.value)
            }
            value={subjectCategoryIdAsString}
            $flexDirection="row"
            $flexWrap="wrap"
            $gap={
              context === "curriculum-visualiser" ? "spacing-8" : "spacing-12"
            }
          >
            <OakP
              as="legend"
              $font={
                context === "integrated-journey"
                  ? "heading-7"
                  : ["heading-7", "heading-6"]
              }
              $mt="spacing-0"
              $mb={["spacing-24", "spacing-16"]}
            >
              Category
              {subjectCategoriesAt.length === 1
                ? ` (${subjectCategoriesAt[0]?.toUpperCase()})`
                : ""}
            </OakP>
            {subjectCategories.map((subjectCategory) => {
              return (
                <OakRadioAsButton
                  variant="with-icon"
                  key={String(subjectCategory.slug)}
                  value={String(subjectCategory.slug)}
                  data-testid={`subject-category-radio-${subjectCategory.slug}`}
                  displayValue={subjectCategory.title}
                  icon={getValidSubjectCategoryIconById(
                    slugs.subjectSlug,
                    subjectCategory.slug,
                  )}
                />
              );
            })}
          </OakRadioGroup>
        </OakBox>
      )}
    </>
  );
}
