import {
  OakHeading,
  OakRadioGroup,
  OakRadioAsButton,
  OakBox,
} from "@oaknational/oak-components";
import { useMemo, useId } from "react";

import { getValidSubjectCategoryIconById } from "@/utils/getValidSubjectCategoryIconById";
import { CurriculumFilters } from "@/utils/curriculum/types";
import { getFilterData } from "@/utils/curriculum/filtering";
import {
  byKeyStageSlug,
  presentAtKeyStageSlugs,
} from "@/utils/curriculum/keystage";
import { CurriculumUnitsFormattedData } from "@/pages-helpers/curriculum/docx/tab-helpers";

export type CurricFiltersSubjectCategoriesProps = {
  filters: CurriculumFilters;
  onChangeFilters: (newFilters: CurriculumFilters) => void;
  data: CurriculumUnitsFormattedData;
};

export function CurricFiltersSubjectCategories({
  filters,
  onChangeFilters,
  data,
}: CurricFiltersSubjectCategoriesProps) {
  const id = useId();
  const { yearData } = data;

  const { subjectCategories } = getFilterData(data.yearData, filters.years);

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

  function setSingleInFilter(key: keyof CurriculumFilters, newValue: string) {
    onChangeFilters({ ...filters, [key]: [newValue] });
  }

  const subjectCategoryIdAsString = useMemo(() => {
    return String(filters.subjectCategories[0]);
  }, [filters.subjectCategories]);

  return (
    <>
      {subjectCategoriesAt.length > 0 && (
        <OakBox>
          <OakHeading
            id="subject-categories-label"
            tag="h3"
            $font={"heading-7"}
            $mt="space-between-none"
            $mb="space-between-m"
          >
            Category{" "}
            {subjectCategoriesAt.length === 1
              ? `(${subjectCategoriesAt[0]?.toUpperCase()})`
              : ""}
          </OakHeading>

          <OakRadioGroup
            name={"subject-categories_" + id}
            onChange={(e) =>
              setSingleInFilter("subjectCategories", e.target.value)
            }
            value={subjectCategoryIdAsString}
            $flexDirection="row"
            $flexWrap="wrap"
            $gap="space-between-ssx"
            aria-labelledby="subject-categories-label"
          >
            {subjectCategories.map((subjectCategory) => {
              return (
                <OakRadioAsButton
                  key={String(subjectCategory.id)}
                  value={String(subjectCategory.id)}
                  data-testid={`subject-category-radio-${subjectCategory.id}`}
                  displayValue={subjectCategory.title}
                  icon={getValidSubjectCategoryIconById(subjectCategory.id)}
                />
              );
            })}
          </OakRadioGroup>
        </OakBox>
      )}
    </>
  );
}
