import {
  OakRadioGroup,
  OakRadioAsButton,
  OakBox,
  OakP,
} from "@oaknational/oak-components";
import { useId } from "react";

import {
  getFilterData,
  scopeYearsToKeystageFilter,
} from "@/utils/curriculum/filtering";
import {
  byKeyStageSlug,
  presentAtKeyStageSlugs,
} from "@/utils/curriculum/keystage";
import { CurriculumUnitsFormattedData } from "@/pages-helpers/curriculum/docx/tab-helpers";
import { useBrowseFilters } from "@/context/BrowseFilters";

export type BrowseFiltersTiersProps = {
  data: CurriculumUnitsFormattedData;
};

export function BrowseFiltersTiers({
  data,
}: Readonly<BrowseFiltersTiersProps>) {
  const { filters, setTierFilter } = useBrowseFilters();
  const id = useId();
  const { yearData } = data;

  const effectiveYears = scopeYearsToKeystageFilter(filters);

  const { tiers } = getFilterData(data.yearData, effectiveYears);

  const keyStageSlugData = byKeyStageSlug(yearData);
  const tiersAt = presentAtKeyStageSlugs(
    keyStageSlugData,
    "tiers",
    effectiveYears,
  );

  return (
    <>
      {tiers.length > 0 && (
        <OakBox>
          <OakRadioGroup
            name={"tiers" + id}
            onChange={(e) => setTierFilter(e.target.value)}
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
              Learning tier{" "}
              {tiersAt.length === 1 ? `(${tiersAt[0]?.toUpperCase()})` : ""}
            </OakP>
            {tiers.map((tier) => (
              <OakRadioAsButton
                key={tier.tier_slug}
                value={tier.tier_slug}
                displayValue={tier.tier}
              />
            ))}
          </OakRadioGroup>
        </OakBox>
      )}
    </>
  );
}
