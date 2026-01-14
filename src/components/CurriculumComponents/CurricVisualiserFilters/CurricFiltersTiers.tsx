import {
  OakHeading,
  OakRadioGroup,
  OakRadioAsButton,
  OakBox,
} from "@oaknational/oak-components";
import { useId } from "react";
import { CurriculumFilters } from "@/utils/curriculum/types";
import { getFilterData } from "@/utils/curriculum/filtering";
import {
  byKeyStageSlug,
  presentAtKeyStageSlugs,
} from "@/utils/curriculum/keystage";
import { CurriculumUnitsFormattedData } from "@/pages-helpers/curriculum/docx/tab-helpers";
import { ComponentTypeValueType } from "@/browser-lib/avo/Avo";

export type CurricFiltersTiersProps = {
  filters: CurriculumFilters;
  onChangeFilters: (
    newFilters: CurriculumFilters,
    source: ComponentTypeValueType,
  ) => void;
  data: CurriculumUnitsFormattedData;
};

export function CurricFiltersTiers({
  filters,
  onChangeFilters,
  data,
}: Readonly<CurricFiltersTiersProps>) {
  const id = useId();
  const { yearData } = data;

  const { tiers } = getFilterData(data.yearData, filters.years);

  const keyStageSlugData = byKeyStageSlug(yearData);
  const tiersAt = presentAtKeyStageSlugs(keyStageSlugData, "tiers");

  function setSingleInFilter(key: keyof CurriculumFilters, newValue: string) {
    onChangeFilters({ ...filters, [key]: [newValue] }, "learning_tier_button");
  }

  return (
    <>
      {tiers.length > 0 && (
        <OakBox>
          <OakHeading
            id={"tiers-label"}
            tag="h4"
            $font={["heading-7", "heading-6"]}
            $mt="spacing-0"
            $mb={["spacing-24", "spacing-16"]}
          >
            Learning tier{" "}
            {tiersAt.length === 1 ? `(${tiersAt[0]?.toUpperCase()})` : ""}
          </OakHeading>
          <OakRadioGroup
            name={"tiers" + id}
            onChange={(e) => setSingleInFilter("tiers", e.target.value)}
            value={filters.tiers[0]}
            $flexDirection="row"
            $flexWrap="wrap"
            $gap="spacing-8"
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
        </OakBox>
      )}
    </>
  );
}
