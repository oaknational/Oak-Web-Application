import {
  OakHeading,
  OakRadioGroup,
  OakRadioAsButton,
  OakBox,
} from "@oaknational/oak-components";
import { useId } from "react";

import { CurriculumFilters, Unit } from "@/utils/curriculum/types";
import { getValidSubjectIconName } from "@/utils/getValidSubjectIconName";
import { getFilterData } from "@/utils/curriculum/filtering";
import {
  byKeyStageSlug,
  presentAtKeyStageSlugs,
} from "@/utils/curriculum/keystage";
import { CurriculumUnitsFormattedData } from "@/pages-helpers/curriculum/docx/tab-helpers";

export type CurricFiltersChildSubjectsProps = {
  filters: CurriculumFilters;
  onChangeFilters: (newFilters: CurriculumFilters) => void;
  data: CurriculumUnitsFormattedData<Unit>;
};

export function CurricFiltersChildSubjects({
  filters,
  onChangeFilters,
  data,
}: CurricFiltersChildSubjectsProps) {
  const id = useId();
  const { yearData } = data;

  const { childSubjects } = getFilterData(data.yearData, filters.years);

  const keyStageSlugData = byKeyStageSlug(yearData);
  const childSubjectsAt = presentAtKeyStageSlugs(
    keyStageSlugData,
    "childSubjects",
    filters.years,
  );

  function setSingleInFilter(key: keyof CurriculumFilters, newValue: string) {
    onChangeFilters({ ...filters, [key]: [newValue] });
  }

  return (
    <OakBox>
      {childSubjects.length > 0 && (
        <>
          <OakHeading
            id="child-subjects-label"
            tag="h4"
            $font={"heading-6"}
            $mb="space-between-s"
          >
            Exam subject
            {childSubjectsAt.length === 1
              ? ` (${childSubjectsAt[0]?.toUpperCase()})`
              : ""}
          </OakHeading>
          <OakRadioGroup
            name={"childSubjects_" + id}
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
    </OakBox>
  );
}
