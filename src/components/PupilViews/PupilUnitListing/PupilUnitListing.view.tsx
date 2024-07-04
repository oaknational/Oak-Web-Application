import { useState } from "react";
import {
  OakPupilJourneyLayout,
  OakTertiaryButton,
  OakPupilJourneyHeader,
  OakBox,
  OakFlex,
  OakSecondaryButton,
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
  const [filterItems, setFilterItems] = useState<string[]>(subjectCategories);

  const applyFilter = (subjectCategory: string) => {
    if (subjectCategory === "All") {
      setFilterItems(subjectCategories);
    } else {
      setFilterItems([subjectCategory]);
    }
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
            key={i}
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
                <OakFlex>
                  <OakSecondaryButton onClick={() => applyFilter("All")}>
                    All
                  </OakSecondaryButton>
                  {subjectCategories.map((category) => (
                    <OakSecondaryButton onClick={() => applyFilter(category)}>
                      {category}
                    </OakSecondaryButton>
                  ))}
                </OakFlex>
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
