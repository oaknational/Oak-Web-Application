import {
  OakFlex,
  OakInfo,
  OakHeading,
  OakPupilJourneyListItem,
  OakPupilJourneyList,
  OakSpan,
  OakPupilJourneyOptionalityItem,
  OakPupilJourneyOptionalityButton,
  OakPupilJourneyUnitsFilter,
} from "@oaknational/oak-components";
import _ from "lodash";

import { resolveOakHref } from "@/common-lib/urls";
import { UnitListingBrowseData } from "@/node-lib/curriculum-api-2023/queries/pupilUnitListing/pupilUnitListing.schema";

const FilterSlot = ({
  subjectCategories,
  applyFilter,
}: {
  subjectCategories: string[];
  applyFilter: (subjectCategory: string) => void;
}) => {
  if (subjectCategories.length === 0) {
    return null;
  }

  return (
    <OakFlex $justifyContent={["start", "start", "end"]}>
      <OakPupilJourneyUnitsFilter
        menuItems={[
          { value: "All", displayText: "All" },
          subjectCategories.map((category) => ({
            value: category,
            displayText: category,
          })),
        ].flat()}
        onSelected={(value) => {
          applyFilter(value.value);
        }}
        selected={"All"}
      />
    </OakFlex>
  );
};

export type PupilUnitsSectionProps = {
  units: UnitListingBrowseData[number][][];
  phase: "primary" | "secondary";
  counterText: string | null;
  counterLength: number | null;
  titleSlot: JSX.Element | null;
  subjectCategories: string[];
  filterItems: string[];
  applyFilter: (subjectCategory: string) => void;
  id?: string;
};

export const PupilUnitsSection = ({
  units,
  phase,
  counterText,
  titleSlot,
  subjectCategories,
  filterItems,
  applyFilter,
  id = "0",
}: PupilUnitsSectionProps) => {
  const indexedUnits = units.map((unit, i) =>
    unit.map((u) => ({ ...u, supplementaryData: { unitOrder: i } })),
  );

  const filteredUnits =
    filterItems.length > 0
      ? indexedUnits.filter(
          (unit) =>
            unit[0] &&
            (_.intersection(unit[0].unitData.subjectcategories, filterItems)
              .length > 0 ||
              filterItems.includes("All")),
        )
      : indexedUnits;

  const filterSlot = titleSlot ? (
    <FilterSlot
      subjectCategories={subjectCategories}
      applyFilter={applyFilter}
    />
  ) : null;

  // don't display empty listings (NB. this scenario shouldn't happen with non-legacy data)
  if (filteredUnits.length === 0) {
    return null;
  }

  return (
    <OakPupilJourneyList
      phase={phase}
      titleSlot={titleSlot}
      filterSlot={filterSlot}
      counterSlot={
        <OakFlex $flexDirection={"column"} $width={"100%"}>
          <OakFlex $gap="space-between-xs" $alignItems={"center"}>
            <OakInfo
              id={`unit-info-${id}`}
              hint="Units are groups of lessons that relate to one another."
              tooltipPosition="top-left"
            />
            <OakHeading tag="h2" $font={"heading-6"} data-testid="unit-count">
              {counterText}{" "}
              <OakSpan $font={"heading-light-6"}>
                ({filteredUnits.length})
              </OakSpan>
            </OakHeading>
          </OakFlex>
        </OakFlex>
      }
    >
      {filteredUnits.length > 0
        ? filteredUnits.map((optionalityUnit, i) => {
            if (optionalityUnit.length === 1) {
              // No optionalities
              if (optionalityUnit[0])
                return renderListItem(
                  optionalityUnit[0],
                  optionalityUnit[0].supplementaryData.unitOrder,
                );
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
          })
        : "No units found"}
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
