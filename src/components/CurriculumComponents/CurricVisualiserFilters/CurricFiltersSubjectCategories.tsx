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
          <OakHeading
            id="subject-categories-label"
            tag="h4"
            $font={
              context === "integrated-journey"
                ? "heading-7"
                : ["heading-7", "heading-6"]
            }
            $mt="spacing-0"
            $mb={["spacing-24", "spacing-16"]}
          >
            Category
            {subjectCategoriesAt.length === 1 &&
            context === "curriculum-visualiser"
              ? ` (${subjectCategoriesAt[0]?.toUpperCase()})`
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
            $gap="spacing-8"
            aria-labelledby="subject-categories-label"
          >
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
