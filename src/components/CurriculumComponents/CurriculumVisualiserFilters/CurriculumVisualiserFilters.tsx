import { OakBox } from "@oaknational/oak-components";

import CurriculumVisualiserFiltersDesktop from "./CurriculumVisualiserFiltersDesktop";

import {
  CurriculumUnitsFormattedData,
  CurriculumUnitsTrackingData,
} from "@/pages/teachers/curriculum/[subjectPhaseSlug]/[tab]";
import { Thread, YearSelection } from "@/utils/curriculum/types";

export type CurriculumVisualiserFiltersProps = {
  selectedThread: Thread["slug"] | null;
  onSelectThread: (newThread: Thread["slug"]) => void;
  selectedYear: string;
  onSelectYear: (newYear: string) => void;
  data: CurriculumUnitsFormattedData;
  trackingData: CurriculumUnitsTrackingData;
  yearSelection: YearSelection;
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
