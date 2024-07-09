import { useState } from "react";
import {
  OakPupilJourneyLayout,
  OakTertiaryButton,
  OakPupilJourneyHeader,
  OakBox,
  OakButtonAsRadioGroup,
  OakSecondaryButtonAsRadio,
} from "@oaknational/oak-components";

import { UseBackHrefProps, useBackHref } from "./useBackHref";

import { UnitsSectionData } from "@/pages/pupils/programmes/[programmeSlug]/units";
import { UnitsSection } from "@/components/PupilComponents/UnitsSection/UnitsSection";

export type PupilViewsUnitListingProps = {
  unitSections: UnitsSectionData[];
  phase: "primary" | "secondary";
  backHrefSlugs: UseBackHrefProps;
  subjectCategories: string[];
};

export const PupilViewsUnitListing = ({
  unitSections,
  phase,
  backHrefSlugs,
  subjectCategories,
}: PupilViewsUnitListingProps) => {
  const [backHref, backLabel] = useBackHref(backHrefSlugs);
  const [filterItems, setFilterItems] = useState<string[]>(["All"]);

  const applyFilter = (subjectCategory: string) => {
    setFilterItems([subjectCategory]);
  };

  return (
    <OakPupilJourneyLayout
      phase={phase}
      sectionName="unit-listing"
      topNavSlot={
        <OakTertiaryButton element="a" href={backHref} iconName="arrow-left">
          {backLabel}
        </OakTertiaryButton>
      }
    >
      <OakBox $mb={"space-between-xl"}>
        {unitSections.map((unitSection, i) => (
          <UnitsSection
            key={unitSection.title}
            titleSlot={
              unitSection.title && unitSection.icon ? (
                <OakPupilJourneyHeader
                  title={unitSection.title}
                  iconName={unitSection.icon}
                  iconBackground={phase}
                  breadcrumbs={unitSection.breadcrumbs}
                />
              ) : null
            }
            filterSlot={
              unitSection.title &&
              unitSection.icon &&
              subjectCategories.length > 0 ? (
                <OakButtonAsRadioGroup
                  name="categories"
                  ariaLabel="categories"
                  onChange={(value) => {
                    applyFilter(value);
                  }}
                  defaultValue="All"
                >
                  <OakSecondaryButtonAsRadio value={"All"}>
                    All
                  </OakSecondaryButtonAsRadio>
                  {subjectCategories.map((category) => (
                    <OakSecondaryButtonAsRadio key={category} value={category}>
                      {category}
                    </OakSecondaryButtonAsRadio>
                  ))}
                </OakButtonAsRadioGroup>
              ) : null
            }
            filterItems={filterItems}
            phase={phase}
            units={unitSection.units}
            counterText={unitSection.counterText}
            counterLength={unitSection.counterLength}
            id={`section-${i}`}
          />
        ))}
      </OakBox>
    </OakPupilJourneyLayout>
  );
};
