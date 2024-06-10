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

  // TODO - consider moving unitsByProgramme, mainUnits and optionalityUnits to getStaticProps
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

  const secondUnitSectionProps = getSecondUnitSectionProps({
    programmeSlug,
    baseSlug,
    tierSlug,
    phase,
    unitsByProgramme,
  });

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
          counterText="Choose a unit"
          counterLength={mainUnits.length}
        />
        {secondUnitSectionProps && secondUnitSectionProps.units.length > 0 && (
          <UnitSection {...secondUnitSectionProps} />
        )}
      </OakBox>
    </OakPupilJourneyLayout>
  );
};

interface GetSecondUnitSectionPropsArgs {
  programmeSlug: string;
  baseSlug: string;
  tierSlug: string | null;
  phase: "primary" | "secondary";
  unitsByProgramme: Record<string, UnitListingBrowseData[number][]>;
}

export function getSecondUnitSectionProps({
  programmeSlug,
  baseSlug,
  tierSlug,
  phase,
  unitsByProgramme,
}: GetSecondUnitSectionPropsArgs): UnitSectionProps {
  // determine if the desired programme is a legacy programme
  const isLegacy = programmeSlug.slice(-2) === "-l";
  const props: Partial<UnitSectionProps> = {};
  if (isLegacy) {
    //check for new programmes that could be displayed
    props.units = Object.values(
      _.groupBy(
        unitsByProgramme[`${programmeSlug.replace("-l", "")}`] || [],
        (unit) => unit.unitData.title,
      ),
    );
    props.counterText = "Choose a new unit";
    props.counterLength = props.units.length;
  } else {
    //check for legacy programmes that could be displayed
    if (tierSlug) {
      props.units = Object.values(
        _.groupBy(
          unitsByProgramme[`${baseSlug}-${tierSlug}-l`] || [],
          (unit) => unit.unitData.title,
        ),
      );
    }
    if (!props.units || props.units.length === 0) {
      props.units = Object.values(
        _.groupBy(
          unitsByProgramme[`${baseSlug}-l`] || [],
          (unit) => unit.unitData.title,
        ),
      );
    }
    props.counterText = "Choose a legacy unit";
    props.counterLength = props.units.length;
  }
  return {
    units: props.units,
    phase: phase,
    counterText: props.counterText,
    counterLength: props.counterLength,
    titleSlot: null,
  };
}

type UnitSectionProps = {
  units: UnitListingBrowseData[number][][];
  phase: "primary" | "secondary";
  counterText: string | null;
  counterLength: number | null;
  titleSlot: JSX.Element | null;
};

const UnitSection = ({
  units,
  phase,
  counterText,
  counterLength,
  titleSlot,
}: UnitSectionProps) => {
  return (
    <OakPupilJourneyList
      phase={phase}
      titleSlot={titleSlot}
      counterSlot={
        <OakFlex $gap="space-between-xs" $alignItems={"center"}>
          <OakInfo
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
