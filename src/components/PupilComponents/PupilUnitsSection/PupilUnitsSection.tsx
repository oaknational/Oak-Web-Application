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
  OakBulletList,
} from "@oaknational/oak-components";
import { intersection } from "lodash";

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
  expiredSlot?: React.ReactNode | null;
  subjectCategories: string[];
  labels?: string[] | undefined;
  filterItems: string[];
  applyFilter: (subjectCategory: string) => void;
  showTooltip?: boolean;
  id?: string;
  onUnitSelected?: (unit: UnitListingBrowseData[number]) => void;
};

export const PupilUnitsSection = ({
  units,
  phase,
  counterText,
  titleSlot,
  subjectCategories,
  labels,
  filterItems,
  applyFilter,
  showTooltip = true,
  expiredSlot,
  id = "0",
  onUnitSelected,
}: PupilUnitsSectionProps) => {
  const indexedUnits = units.map((unit, i) =>
    unit.map((u) => ({ ...u, supplementaryData: { unitOrder: i } })),
  );

  const filteredUnits =
    filterItems.length > 0
      ? indexedUnits.filter(
          (unit) =>
            unit[0] &&
            (intersection(unit[0].unitData.subjectcategories, filterItems)
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
      subheadingSlot={
        <OakFlex
          $flexDirection={"column"}
          $width={"100%"}
          $gap={"space-between-s"}
        >
          <OakFlex
            $gap="space-between-xs"
            $alignItems={"center"}
            $justifyContent="start"
          >
            {showTooltip && (
              <OakInfo
                id={`unit-info-${id}`}
                hint="Units are groups of lessons that relate to one another."
                tooltipPosition="top-left"
              />
            )}
            <OakFlex
              $flexDirection={["column", "row"]}
              $flexWrap={"wrap"}
              $justifyContent={["start", "space-between"]}
              $flexGrow={[null, 1]}
              $alignItems={["flex-start", "center"]}
              $gap={"space-between-m"}
            >
              <OakHeading tag="h2" $font={"heading-6"} data-testid="unit-count">
                {counterText}{" "}
                <OakSpan $font={"heading-light-6"}>
                  ({filteredUnits.length})
                </OakSpan>
              </OakHeading>
              {labels && (
                <OakBulletList
                  listItems={labels}
                  $background={"bg-decorative5-very-subdued"}
                  $borderRadius={"border-radius-s"}
                  $borderColor={"border-decorative5"}
                  $ba={"border-solid-s"}
                  $ph={"inner-padding-xs"}
                  $pv={"inner-padding-ssx"}
                />
              )}
            </OakFlex>
          </OakFlex>
          {expiredSlot}
        </OakFlex>
      }
    >
      {filteredUnits.length > 0
        ? filteredUnits.map((optionalityUnit) => {
            if (optionalityUnit.length === 1) {
              // No optionalities
              if (optionalityUnit[0])
                return renderListItem(
                  optionalityUnit[0],
                  optionalityUnit[0].supplementaryData.unitOrder,
                  onUnitSelected,
                );
            } else {
              // More than 2 optionalities and therefore needs sublistings
              if (optionalityUnit[0])
                return (
                  <OakPupilJourneyOptionalityItem
                    key={optionalityUnit[0]?.unitData.slug}
                    index={optionalityUnit[0].supplementaryData.unitOrder + 1}
                    title={optionalityUnit[0]?.unitData.title}
                  >
                    {optionalityUnit.map(
                      (unit) =>
                        unit.programmeFields.optionality && (
                          <OakPupilJourneyOptionalityButton
                            key={unit.unitSlug}
                            title={unit.programmeFields.optionality}
                            numberOfLessons={unit.lessonCount}
                            href={resolveOakHref({
                              page: "pupil-lesson-index",
                              programmeSlug: unit.programmeSlug,
                              unitSlug: unit.unitSlug,
                            })}
                            onClick={() => {
                              if (onUnitSelected) onUnitSelected(unit);
                            }}
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

const renderListItem = (
  unit: UnitListingBrowseData[number],
  index: number,
  onCallback?: (unit: UnitListingBrowseData[number]) => void,
) => (
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
    onClick={() => {
      if (onCallback) {
        onCallback(unit);
      }
    }}
    unavailable={unit.expired}
  />
);
