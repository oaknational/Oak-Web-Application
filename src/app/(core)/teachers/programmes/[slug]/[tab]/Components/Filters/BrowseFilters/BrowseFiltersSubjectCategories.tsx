import {
  OakRadioGroup,
  OakRadioAsButton,
  OakBox,
  OakP,
} from "@oaknational/oak-components";
import { useMemo, useId } from "react";

import { getValidSubjectCategoryIconById } from "@/utils/getValidSubjectCategoryIconById";
import {
  getFilterData,
  scopeYearsToKeystageFilter,
} from "@/utils/curriculum/filtering";
import {
  byKeyStageSlug,
  presentAtKeyStageSlugs,
} from "@/utils/curriculum/keystage";
import { CurriculumUnitsFormattedData } from "@/pages-helpers/curriculum/docx/tab-helpers";
import { CurriculumSelectionSlugs } from "@/utils/curriculum/slugs";
import { useBrowseFilters } from "@/context/BrowseFilters";

export type BrowseFiltersSubjectCategoriesProps = {
  data: CurriculumUnitsFormattedData;
  slugs: CurriculumSelectionSlugs;
};

export function BrowseFiltersSubjectCategories({
  data,
  slugs,
}: Readonly<BrowseFiltersSubjectCategoriesProps>) {
  const { filters, setSubjectCategoryFilter } = useBrowseFilters();
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

  const subjectCategoryIdAsString = useMemo(() => {
    return String(filters.subjectCategories[0]);
  }, [filters.subjectCategories]);

  return (
    <>
      {subjectCategoriesAt.length > 0 && (
        <OakBox>
          <OakRadioGroup
            name={"subject-categories_" + id}
            onChange={(e) => setSubjectCategoryFilter(e.target.value)}
            value={subjectCategoryIdAsString}
            $flexDirection="row"
            $flexWrap="wrap"
            $gap="spacing-12"
          >
            <OakP
              as="legend"
              $font="heading-7"
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
