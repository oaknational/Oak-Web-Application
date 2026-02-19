import {
  OakRadioGroup,
  OakRadioAsButton,
  OakBox,
  OakP,
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
import { ComponentTypeValueType } from "@/browser-lib/avo/Avo";

export type CurricFiltersChildSubjectsProps = {
  filters: CurriculumFilters;
  onChangeFilters: (
    newFilters: CurriculumFilters,
    source: ComponentTypeValueType,
  ) => void;
  data: CurriculumUnitsFormattedData<Unit>;
  // The context prop can be removed once the integrated journey is fully launched
  context: "curriculum-visualiser" | "integrated-journey";
};

export function CurricFiltersChildSubjects({
  filters,
  onChangeFilters,
  data,
  context,
}: Readonly<CurricFiltersChildSubjectsProps>) {
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
    onChangeFilters({ ...filters, [key]: [newValue] }, "child_subject_button");
  }

  return (
    <OakBox>
      {childSubjects.length > 0 && (
        <OakRadioGroup
          name={"childSubjects_" + id}
          onChange={(e) => setSingleInFilter("childSubjects", e.target.value)}
          value={String(filters.childSubjects[0]!)}
          $flexDirection="row"
          $flexWrap="wrap"
          $gap="spacing-8"
        >
          <OakP
            as="legend"
            $font={
              context === "curriculum-visualiser" ? "heading-6" : "heading-7"
            }
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
