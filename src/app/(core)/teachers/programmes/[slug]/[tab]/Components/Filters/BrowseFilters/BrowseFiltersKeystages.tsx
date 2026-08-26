import {
  OakRadioGroup,
  OakRadioAsButton,
  OakBox,
  OakP,
} from "@oaknational/oak-components";
import { useId } from "react";

import { CurriculumUnitsFormattedData } from "@/pages-helpers/curriculum/docx/tab-helpers";
import { useBrowseFilters } from "@/context/BrowseFilters";

export type BrowseFiltersKeystagesProps = {
  data: CurriculumUnitsFormattedData;
};

export function BrowseFiltersKeystages({
  data,
}: Readonly<BrowseFiltersKeystagesProps>) {
  const { filters, setKeystageFilter } = useBrowseFilters();
  const id = useId();

  return (
    <>
      {data.keystages.length > 1 && (
        <OakBox>
          <OakRadioGroup
            name={"tiers" + id}
            onChange={(e) => setKeystageFilter(e.target.value)}
            value={filters.tiers[0]}
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
              Key stages
            </OakP>
            {data.keystages.map((ks) => (
              <OakRadioAsButton key={ks} value={ks} displayValue={ks} />
            ))}
          </OakRadioGroup>
        </OakBox>
      )}
    </>
  );
}
