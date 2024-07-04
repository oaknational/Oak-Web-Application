import {
  OakFlex,
  OakInfo,
  OakHeading,
  OakPupilJourneyListItem,
  OakPupilJourneyList,
  OakSpan,
  OakPupilJourneyOptionalityItem,
  OakPupilJourneyOptionalityButton,
} from "@oaknational/oak-components";

import { resolveOakHref } from "@/common-lib/urls";
import { UnitListingBrowseData } from "@/node-lib/curriculum-api-2023/queries/pupilUnitListing/pupilUnitListing.schema";

export type UnitsSectionProps = {
  units: UnitListingBrowseData[number][][];
  phase: "primary" | "secondary";
  counterText: string | null;
  counterLength: number | null;
  titleSlot: JSX.Element | null;
  id?: string;
};

export const UnitsSection = ({
  units,
  phase,
  counterText,
  counterLength,
  titleSlot,
  id = "0",
}: UnitsSectionProps) => {
  if (units.length === 0) return null;
  return (
    <OakPupilJourneyList
      phase={phase}
      titleSlot={titleSlot}
      counterSlot={
        <OakFlex $gap="space-between-xs" $alignItems={"center"}>
          <OakInfo
            id={`unit-info-${id}`}
            hint="Units are groups of lessons that relate to one another."
            tooltipPosition="top-left"
          />

          <OakHeading tag="h2" $font={"heading-6"} data-testid="unit-count">
            {counterText}{" "}
            <OakSpan $font={"heading-light-6"}>({counterLength})</OakSpan>
          </OakHeading>
        </OakFlex>
      }
    >
      {units.map((optionalityUnit, i) => {
        if (optionalityUnit.length === 1) {
          // No optionalities
          if (optionalityUnit[0]) return renderListItem(optionalityUnit[0], i);
        } else if (optionalityUnit.length === 2) {
          // 2 optionalities, doesn't need sublistings but the unit with optionality should be used for the title.
          const unit = optionalityUnit.find(
            (unit) => unit.programmeFields.optionality,
          );
          if (unit) return renderListItem(unit, i);
        } else {
          // More than 2 optionalities and therefore needs sublistings
          if (optionalityUnit[0])
            return (
              <OakPupilJourneyOptionalityItem
                key={i}
                index={i + 1}
                title={optionalityUnit[0]?.unitData.title}
              >
                {optionalityUnit.map(
                  (unit, index) =>
                    unit.programmeFields.optionality && (
                      <OakPupilJourneyOptionalityButton
                        key={index}
                        title={unit.programmeFields.optionality}
                        numberOfLessons={unit.lessonCount}
                        href={resolveOakHref({
                          page: "pupil-lesson-index",
                          programmeSlug: unit.programmeSlug,
                          unitSlug: unit.unitSlug,
                        })}
                        unavailable={unit.expired}
                      />
                    ),
                )}
              </OakPupilJourneyOptionalityItem>
            );
        }
      })}
    </OakPupilJourneyList>
  );
};

const renderListItem = (unit: UnitListingBrowseData[number], index: number) => (
  <OakPupilJourneyListItem
    key={index}
    title={`${unit.unitData.title}${
      unit.programmeFields.optionality
        ? ` - ${unit.programmeFields.optionality}`
        : ""
    }`}
    index={index + 1}
    numberOfLessons={unit.lessonCount}
    as="a"
    href={resolveOakHref({
      page: "pupil-lesson-index",
      programmeSlug: unit.programmeSlug,
      unitSlug: unit.unitSlug,
    })}
    unavailable={unit.expired}
  />
);
