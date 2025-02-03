import { OakBox } from "@oaknational/oak-components";

import CurriculumVisualiserFiltersDesktop from "./CurriculumVisualiserFiltersDesktop";

import { Subject, Thread, Tier } from "@/utils/curriculum/types";
import {
  CurriculumUnitsFormattedData,
  CurriculumUnitsTrackingData,
} from "@/pages-helpers/curriculum/docx/tab-helpers";

export type CurriculumFilters = {
  childSubjects: Subject["subject_slug"][];
  subjectCategories: string[];
  tiers: Tier["tier_slug"][];
  years: string[];
  threads: Thread["slug"][];
};

export type CurriculumVisualiserFiltersProps = {
  filters: CurriculumFilters;
  onChangeFilters: (newFilters: CurriculumFilters) => void;
  data: CurriculumUnitsFormattedData;
  trackingData: CurriculumUnitsTrackingData;
};

export default function CurriculumVisualiserFilters(
  props: CurriculumVisualiserFiltersProps,
) {
  return (
    <>
      <OakBox $display={["none", "block"]}>
        <CurriculumVisualiserFiltersDesktop {...props} />
      </OakBox>
    </>
  );
}
