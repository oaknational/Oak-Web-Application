import {
  OakPupilJourneyLayout,
  OakTertiaryButton,
  OakPupilJourneyHeader,
  OakFlex,
  OakInfo,
  OakHeading,
  OakPupilJourneyListItem,
  OakPupilJourneyList,
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
    tier,
    tierSlug,
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
  if (tier) {
    breadcrumbs.push(tier);
  }
  if (examboard) {
    breadcrumbs.push(examboard);
  }

  return (
    <OakPupilJourneyLayout
      phase={phase}
      sectionName="unit-listing"
      topNavSlot={
        <OakTertiaryButton element="a" href={backHref} iconName="arrow-left">
          {backLabel}
        </OakTertiaryButton>
      }
      titleSlot={
        <OakPupilJourneyHeader
          title={subject}
          iconName={`subject-${subjectSlug}`}
          iconBackground={phase}
          breadcrumbs={breadcrumbs}
        />
      }
    >
      <OakFlex $gap="space-between-xs" $alignItems={"center"}>
        <OakInfo
          hint="Units are groups of lessons that relate to one another."
          tooltipPosition="top-left"
        />

        <OakHeading tag="h2">New lessons ({lessonCount})</OakHeading>
      </OakFlex>

      <OakPupilJourneyList phase={phase}>
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
