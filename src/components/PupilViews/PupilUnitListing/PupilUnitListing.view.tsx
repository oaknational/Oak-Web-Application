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
        New lessons{" "}
        <OakSpan $font={"heading-light-6"}>{`(${lessonCount})`}</OakSpan>
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
              const unit = optionalityUnit[0];
              if (unit)
                return (
                  <OakPupilJourneyListItem
                    key={unit.unitSlug}
                    title={unit.unitData.title}
                    index={i + 1}
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
            } else if (optionalityUnit.length === 2) {
              const filteredUnit = optionalityUnit.filter(
                (unit) => unit.programmeFields.optionality,
              );
              const unit = filteredUnit[0];
              if (unit) {
                const optionality = unit.programmeFields.optionality;
                if (optionality) {
                  return (
                    <OakPupilJourneyListItem
                      key={unit.unitSlug}
                      title={`${unit.unitData.title} - ${optionality}`}
                      index={i + 1}
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
                }
              }
            } else {
              if (optionalityUnit[0]) {
                const title = optionalityUnit[0].unitData.title;
                return (
                  <OakPupilJourneyOptionalityItem index={i + 1} title={title}>
                    {optionalityUnit.map((unit) => {
                      const optionality = unit.programmeFields.optionality;
                      if (optionality)
                        return (
                          <OakPupilJourneyOptionalityButton
                            title={optionality}
                            numberOfLessons={unit.lessonCount}
                            href={resolveOakHref({
                              page: "pupil-lesson-index",
                              programmeSlug: unit.programmeSlug,
                              unitSlug: unit.unitSlug,
                            })}
                            unavailable={unit.expired}
                          />
                        );
                    })}
                  </OakPupilJourneyOptionalityItem>
                );
              }
            }
          })}
        </OakPupilJourneyList>
      </OakBox>
    </OakPupilJourneyLayout>
  );
};
