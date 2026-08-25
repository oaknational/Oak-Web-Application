import {
  OakRadioGroup,
  OakRadioAsButton,
  OakBox,
  OakP,
} from "@oaknational/oak-components";
import { useId } from "react";

import { Unit } from "@/utils/curriculum/types";
import { getValidSubjectIconName } from "@/utils/getValidSubjectIconName";
import {
  getFilterData,
  scopeYearsToKeystageFilter,
} from "@/utils/curriculum/filtering";
import {
  byKeyStageSlug,
  presentAtKeyStageSlugs,
} from "@/utils/curriculum/keystage";
import { CurriculumUnitsFormattedData } from "@/pages-helpers/curriculum/docx/tab-helpers";
import { FilterType } from "@/browser-lib/avo/Avo";
import { useBrowseFilters } from "@/context/BrowseFilters";

export type BrowseFiltersChildSubjectsProps = {
  data: CurriculumUnitsFormattedData<Unit>;
};

export function BrowseFiltersChildSubjects({
  data,
}: Readonly<BrowseFiltersChildSubjectsProps>) {
  const { filters, setSingleFilter } = useBrowseFilters();
  const id = useId();
  const { yearData } = data;

  const effectiveYears = scopeYearsToKeystageFilter(filters);

  const { childSubjects } = getFilterData(data.yearData, effectiveYears);

  const keyStageSlugData = byKeyStageSlug(yearData);
  const childSubjectsAt = presentAtKeyStageSlugs(
    keyStageSlugData,
    "childSubjects",
    effectiveYears,
  );

  return (
    <OakBox>
      {childSubjects.length > 0 && (
        <OakRadioGroup
          name={"childSubjects_" + id}
          onChange={(e) =>
            setSingleFilter(
              "childSubjects",
              e.target.value,
              FilterType.SUBJECT_FILTER,
            )
          }
          value={String(filters.childSubjects[0]!)}
          $flexDirection="row"
          $flexWrap="wrap"
          $gap="spacing-8"
        >
          <OakP
            as="legend"
            $font="heading-7"
            $mt="spacing-0"
            $mb={["spacing-24", "spacing-16"]}
          >
            Exam subject
            {childSubjectsAt.length === 1
              ? ` (${childSubjectsAt[0]?.toUpperCase()})`
              : ""}
          </OakP>
          {childSubjects.map((childSubject) => (
            <OakRadioAsButton
              variant="with-icon"
              key={childSubject.subject_slug}
              value={childSubject.subject_slug}
              displayValue={childSubject.subject}
              icon={getValidSubjectIconName(childSubject.subject_slug)}
            />
          ))}
        </OakRadioGroup>
      )}
    </OakBox>
  );
}
