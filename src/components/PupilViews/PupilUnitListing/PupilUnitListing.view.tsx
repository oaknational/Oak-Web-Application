import {
  OakPupilJourneyLayout,
  OakTertiaryButton,
  OakPupilJourneyHeader,
  OakBox,
} from "@oaknational/oak-components";

import { UseBackHrefProps, useBackHref } from "./useBackHref";

import { UnitsSectionData } from "@/pages/pupils/programmes/[programmeSlug]/units";
import { UnitsSection } from "@/components/PupilComponents/UnitsSection/UnitsSection";

export type PupilViewsUnitListingProps = {
  unitSections: UnitsSectionData[];
  phase: "primary" | "secondary";
  backHrefSlugs: UseBackHrefProps;
};

export const PupilViewsUnitListing = ({
  unitSections,
  phase,
  backHrefSlugs,
}: PupilViewsUnitListingProps) => {
  const [backHref, backLabel] = useBackHref(backHrefSlugs);

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
