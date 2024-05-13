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
} from "@oaknational/oak-components";

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

  const lessonCount = units.reduce((p, c) => p + c.lessonCount, 0);

  const breadcrumbs: string[] = [yearDescription];
  if (tierDescription) {
    breadcrumbs.push(tierDescription);
  }
  if (examboard) {
    breadcrumbs.push(examboard);
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
        {units.map((unit, i) => {
          return (
            <OakPupilJourneyListItem
              key={unit.unitSlug}
              title={unit.unitData?.title}
              index={i + 1}
              numberOfLessons={unit.lessonCount}
              as="a"
              href={resolveOakHref({
                page: "pupil-lesson-index",
                programmeSlug: unit.programmeSlug,
                unitSlug: unit.unitSlug,
              })}
            />
          );
        })}
      </OakPupilJourneyList>
    </OakPupilJourneyLayout>
  );
};
