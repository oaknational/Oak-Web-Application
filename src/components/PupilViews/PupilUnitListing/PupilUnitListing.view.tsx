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
};

export const PupilViewsUnitListing = ({
  programmeFields,
  units,
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
    legacy,
  } = programmeFields;

  if (phase === "foundation") {
    throw new Error("Foundation phase not supported");
  }

  const baseSlug = `${subjectSlug}-${phaseSlug}-${yearSlug}`;

  const [backHref, backLabel] = useBackHref({
    baseSlug,
    yearSlug,
    isLegacy: legacy === "true",
    tierSlug: tierSlug,
    examboardSlug: examboardSlug,
  });

  const optionalityUnits = Object.values(
    _.groupBy(units, (unit) => unit.unitData.title),
  );

  const lessonCount = optionalityUnits.reduce((p, optionalityUnit) => {
    if (optionalityUnit.length === 1) {
      if (optionalityUnit[0]) return p + optionalityUnit[0].lessonCount;
    } else {
      const filteredUnit = optionalityUnit.filter(
        (unit) => unit.programmeFields.optionality,
      );
      return p + filteredUnit.reduce((p2, unit) => p2 + unit.lessonCount, 0);
    }
    return p;
  }, 0);

  const breadcrumbs: string[] = [yearDescription];
  if (examboard) {
    breadcrumbs.push(examboard);
  }
  if (tierDescription) {
    breadcrumbs.push(tierDescription);
  }

  const newLessonCount = (
    <OakFlex $gap="space-between-xs" $alignItems={"center"}>
      <OakInfo
        hint="Units are groups of lessons that relate to one another."
        tooltipPosition="top-left"
      />

      <OakHeading tag="h2" $font={"heading-6"}>
        New lessons <OakSpan $font={"heading-light-6"}>({lessonCount})</OakSpan>
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
        <OakPupilJourneyList
          phase={phase}
          titleSlot={
            <OakPupilJourneyHeader
              title={subject}
              iconName={`subject-${subjectSlug}`}
              iconBackground={phase}
              breadcrumbs={breadcrumbs}
            />
          }
          counterSlot={newLessonCount}
        >
          {optionalityUnits.map((optionalityUnit, i) => {
            if (optionalityUnit.length === 1) {
              // No optionalities
              if (optionalityUnit[0])
                return renderListItem(optionalityUnit[0], i);
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
                    index={i + 1}
                    title={optionalityUnit[0]?.unitData.title}
                  >
                    {optionalityUnit.map(
                      (unit) =>
                        unit.programmeFields.optionality && (
                          <OakPupilJourneyOptionalityButton
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
      </OakBox>
    </OakPupilJourneyLayout>
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
