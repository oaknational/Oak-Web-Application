import {
  OakPupilJourneyLayout,
  OakTertiaryButton,
  OakPupilJourneyHeader,
  OakFlex,
  OakInfo,
  OakHeading,
  OakPupilJourneyListItem,
  OakPupilJourneyList,
  OakSpan,
  OakBox,
  OakPupilJourneyOptionalityItem,
  OakPupilJourneyOptionalityButton,
} from "@oaknational/oak-components";
import _ from "lodash";

import { useBackHref } from "./useBackHref";

import { resolveOakHref } from "@/common-lib/urls";
import { ProgrammeFields } from "@/node-lib/curriculum-api-2023/queries/pupilProgrammeListing/pupilProgrammeListing.schema";
import { UnitListingBrowseData } from "@/node-lib/curriculum-api-2023/queries/pupilUnitListing/pupilUnitListing.schema";

export type PupilViewsUnitListingProps = {
  programmeFields: ProgrammeFields;
  units: UnitListingBrowseData;
  programmeSlug: string;
};

export const PupilViewsUnitListing = ({
  programmeFields,
  units,
  programmeSlug,
}: PupilViewsUnitListingProps) => {
  const {
    subject,
    phase,
    yearDescription,
    tierSlug,
    tierDescription,
    examboard,
    yearSlug,
    phaseSlug,
    subjectSlug,
    examboardSlug,
  } = programmeFields;

  if (phase === "foundation") {
    throw new Error("Foundation phase not supported");
  }

  const baseSlug = `${subjectSlug}-${phaseSlug}-${yearSlug}`;

  const [backHref, backLabel] = useBackHref({
    baseSlug,
    yearSlug,
    tierSlug: tierSlug,
    examboardSlug: examboardSlug,
  });

  const unitsByProgramme = _.groupBy(units, "programmeSlug");

  const mainUnits: UnitListingBrowseData[number][] =
    unitsByProgramme[programmeSlug] || [];

  const optionalityUnits: UnitListingBrowseData[number][][] = Object.values(
    _.groupBy(mainUnits, (unit) => unit?.unitData.title),
  );

  const breadcrumbs: string[] = [yearDescription];
  if (examboard) {
    breadcrumbs.push(examboard);
  }
  if (tierDescription) {
    breadcrumbs.push(tierDescription);
  }

  const secondSection: Partial<UnitSectionProps> = {};
  secondSection.titleSlot = null;
  secondSection.phase = phase;

  // determine if the desired programme is a legacy programme
  const isLegacy = programmeSlug.slice(-2) === "-l";
  if (isLegacy) {
    //check for new programmes that could be displayed
    secondSection.units = Object.values(
      _.groupBy(
        unitsByProgramme[`${programmeSlug.replace("-l", "")}`] || [],
        (unit) => unit.unitData.title,
      ),
    );
    secondSection.counterSlot = (
      <OakFlex $gap="space-between-xs" $alignItems={"center"}>
        <OakInfo
          hint="Units are groups of lessons that relate to one another."
          tooltipPosition="top-left"
        />

        <OakHeading
          tag="h2"
          $font={"heading-6"}
          data-testid="secondary-unit-count"
        >
          Select a new unit{" "}
          <OakSpan $font={"heading-light-6"}>
            ({secondSection.units?.length})
          </OakSpan>
        </OakHeading>
      </OakFlex>
    );
    secondSection.titleSlot = null;
  } else {
    //check for legacy programmes that could be displayed
    secondSection.units = Object.values(
      _.groupBy(
        unitsByProgramme[`${programmeSlug}-l`] || [],
        (unit) => unit.unitData.title,
      ),
    );
    secondSection.phase = phase;
    secondSection.counterSlot = (
      <OakFlex $gap="space-between-xs" $alignItems={"center"}>
        <OakInfo
          hint="Units are groups of lessons that relate to one another."
          tooltipPosition="top-left"
        />

        <OakHeading
          tag="h2"
          $font={"heading-6"}
          data-testid="secondary-unit-count"
        >
          Choose a legacy unit{" "}
          <OakSpan $font={"heading-light-6"}>
            ({secondSection.units.length})
          </OakSpan>
        </OakHeading>
      </OakFlex>
    );
    secondSection.titleSlot = null;
  }

  const unitCount = (
    <OakFlex $gap="space-between-xs" $alignItems={"center"}>
      <OakInfo
        hint="Units are groups of lessons that relate to one another."
        tooltipPosition="top-left"
      />

      <OakHeading tag="h2" $font={"heading-6"} data-testid="unit-count">
        Choose a unit{" "}
        <OakSpan $font={"heading-light-6"}>({mainUnits.length})</OakSpan>
      </OakHeading>
    </OakFlex>
  );

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
        <UnitSection
          titleSlot={
            <OakPupilJourneyHeader
              title={subject}
              iconName={`subject-${subjectSlug}`}
              iconBackground={phase}
              breadcrumbs={breadcrumbs}
            />
          }
          phase={phase}
          units={optionalityUnits}
          counterSlot={unitCount}
        />
        {secondSection.units.length > 0 && (
          <UnitSection
            titleSlot={secondSection.titleSlot}
            units={secondSection.units}
            counterSlot={secondSection.counterSlot}
            phase={secondSection.phase}
          />
        )}
      </OakBox>
    </OakPupilJourneyLayout>
  );
};
type UnitSectionProps = {
  units: UnitListingBrowseData[number][][];
  phase: "primary" | "secondary";
  counterSlot: JSX.Element | null;
  titleSlot: JSX.Element | null;
};
const UnitSection = ({
  units,
  phase,
  counterSlot,
  titleSlot,
}: UnitSectionProps) => {
  return (
    <OakPupilJourneyList
      phase={phase}
      titleSlot={titleSlot}
      counterSlot={counterSlot}
    >
      {units.map((optionalityUnit, i) => {
        //console.log(optionalityUnit);

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
    key={unit.unitSlug}
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
