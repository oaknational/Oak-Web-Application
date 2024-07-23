import { useState } from "react";
import {
  OakPupilJourneyLayout,
  OakTertiaryButton,
  OakPupilJourneyHeader,
  OakBox,
} from "@oaknational/oak-components";

import { UseBackHrefProps, useBackHref } from "./useBackHref";

import { UnitsSectionData } from "@/pages/pupils/programmes/[programmeSlug]/units";
import SignpostTeachersInlineBanner from "@/components/PupilComponents/SignpostTeachersInlineBanner/SignpostTeachersInlineBanner";
import { PupilUnitsSection } from "@/components/PupilComponents/PupilUnitsSection";

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
      <OakBox $mb={"space-between-m2"}>
        {unitSections.map((unitSection, i) => {
          let subjectLabel = unitSection.labels?.subject;
          if (
            unitSection.labels?.subject &&
            unitSections[1]?.labels?.subject &&
            filterItems[0] !== undefined &&
            filterItems[0] !== "All"
          ) {
            subjectLabel = filterItems[0];
          }

          const labelsArray = [
            unitSection.labels?.year,
            subjectLabel,
            unitSection.labels?.tier,
          ].filter((label): label is string => Boolean(label));

          return (
            <PupilUnitsSection
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
              subjectCategories={subjectCategories}
              filterItems={filterItems}
              applyFilter={applyFilter}
              phase={phase}
              units={unitSection.units}
              counterText={unitSection.counterText}
              counterLength={unitSection.counterLength}
              labels={labelsArray.length ? labelsArray : undefined}
              showTooltip={i === 0}
              id={`section-${i}`}
            />
          );
        })}
        <OakBox $mt={"space-between-m2"}>
          <SignpostTeachersInlineBanner />
        </OakBox>
      </OakBox>
    </OakPupilJourneyLayout>
  );
};
