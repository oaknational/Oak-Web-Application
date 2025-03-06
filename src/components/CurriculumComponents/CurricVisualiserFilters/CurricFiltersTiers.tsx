import {
  OakHeading,
  OakRadioGroup,
  OakRadioAsButton,
} from "@oaknational/oak-components";

import { CurriculumFilters } from "@/utils/curriculum/types";
import { getFilterData } from "@/utils/curriculum/filtering";
import {
  byKeyStageSlug,
  presentAtKeyStageSlugs,
} from "@/utils/curriculum/keystage";
import { CurriculumUnitsFormattedData } from "@/pages-helpers/curriculum/docx/tab-helpers";

export type CurricFiltersTiersProps = {
  filters: CurriculumFilters;
  onChangeFilters: (newFilters: CurriculumFilters) => void;
  data: CurriculumUnitsFormattedData;
};

export function CurricFiltersTiers({
  filters,
  onChangeFilters,
  data,
}: CurricFiltersTiersProps) {
  const { yearData } = data;

  const { tiers } = getFilterData(data.yearData, filters.years);

  const keyStageSlugData = byKeyStageSlug(yearData);
  const tiersAt = presentAtKeyStageSlugs(keyStageSlugData, "tiers");

  function setSingleInFilter(key: keyof CurriculumFilters, newValue: string) {
    onChangeFilters({ ...filters, [key]: [newValue] });
  }

  return (
    <>
      {tiers.length > 0 && (
        <>
          <OakHeading
            id="tiers-label"
            tag="h4"
            $font={"heading-6"}
            $mb="space-between-s"
          >
            Learning tier{" "}
            {tiersAt.length === 1 ? `(${tiersAt[0]?.toUpperCase()})` : ""}
          </OakHeading>
          <OakRadioGroup
            name="tiers"
            onChange={(e) => setSingleInFilter("tiers", e.target.value)}
            value={filters.tiers[0]!}
            $flexDirection="row"
            $flexWrap="wrap"
            $gap="space-between-ssx"
            aria-labelledby="tiers-label"
          >
            {tiers.map((tier) => (
              <OakRadioAsButton
                key={tier.tier_slug}
                value={tier.tier_slug}
                displayValue={tier.tier}
              />
            ))}
          </OakRadioGroup>
        </>
      )}
    </>
  );
}
