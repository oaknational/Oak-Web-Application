import {
  OakHeading,
  OakRadioGroup,
  OakRadioAsButton,
  OakBox,
} from "@oaknational/oak-components";

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

  return (
    <>
      {subjectCategoriesAt.length > 0 && (
        <OakBox>
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
