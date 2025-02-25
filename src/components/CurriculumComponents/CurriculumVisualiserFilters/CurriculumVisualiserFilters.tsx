import { OakBox } from "@oaknational/oak-components";

import CurriculumVisualiserFiltersDesktop from "./CurriculumVisualiserFiltersDesktop";

import { CurriculumFilters } from "@/utils/curriculum/types";
import {
  CurriculumUnitsFormattedData,
  CurriculumUnitsTrackingData,
} from "@/pages-helpers/curriculum/docx/tab-helpers";

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
