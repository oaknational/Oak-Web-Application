import _ from "lodash";
import {
  OakFlex,
  OakGrid,
  OakGridArea,
  OakHeading,
  OakPupilJourneyLayout,
  OakPupilJourneySubjectButton,
  OakTertiaryButton,
} from "@oaknational/oak-components";

import { ResolveOakHrefProps, resolveOakHref } from "@/common-lib/urls";
import { PupilSubjectListingData } from "@/node-lib/curriculum-api-2023/queries/pupilSubjectListing/pupilSubjectListing.schema";

type PupilViewsSubjectListingProps = {
  subjects: PupilSubjectListingData[];
};

export const PupilViewsSubjectListing = ({
  subjects,
}: PupilViewsSubjectListingProps) => {
  const groupedBySubject = _.groupBy(
    subjects,
    (subject) => subject.programmeFields.subjectSlug,
  );

  const orderedKeys = Object.keys(groupedBySubject).sort((a, b) =>
    a.localeCompare(b),
  );

  return (
    <OakPupilJourneyLayout
      sectionName="subject-listing"
      topNavSlot={
        <OakTertiaryButton
          element="a"
          href={resolveOakHref({
            page: "pupil-year-index",
          })}
          iconName="arrow-left"
        >
          Change year
        </OakTertiaryButton>
      }
    >
      <OakFlex
        $background={"bg-primary"}
        $pt={["inner-padding-xl5", "inner-padding-xl7"]}
        $ph={["inner-padding-l", "inner-padding-xl"]}
        $borderRadius={"border-radius-l"}
        $ba={"border-solid-s"}
        $borderColor={"border-decorative1-stronger"}
        $mb={"space-between-xxl"}
        $flexDirection={"column"}
        $alignItems={"center"}
      >
        <OakHeading $font={["heading-6", "heading-5"]} tag="h1">
          Now choose a subject
        </OakHeading>

        <OakGrid
          $mt={"space-between-l"}
          $pb={"inner-padding-xl"}
          $gridTemplateColumns={[
            "repeat(2, 1fr)",
            "repeat(4, 1fr)",
            "repeat(5, 1fr)",
          ]}
          $rg={"space-between-s"}
          $cg={"space-between-s"}
          role="list"
        >
          {orderedKeys.map((subjectSlug) => {
            const subjectData = groupedBySubject[subjectSlug];
            if (subjectData?.[0]?.programmeFields.phaseSlug === "foundation") {
              throw new Error("Foundation phase is not supported");
            }
            if (!subjectData?.[0]) {
              throw new Error(
                `Error no subject data available for ${subjectSlug}`,
              );
            }

            const examOptions = _.groupBy(
              subjectData,
              (subject) => subject.programmeFields.examboardSlug,
            );
            const tierOptions = _.groupBy(
              subjectData,
              (subject) => subject.programmeFields.tierSlug,
            );
            const hasTierOrExamOptions =
              Object.keys(examOptions).length > 1 ||
              Object.keys(tierOptions).length > 1;

            // If there are multiple matches on subjectSlug, show the non-legacy one.
            const cycle1Subject = subjectData.find(
              (subject) => !subject.isLegacy,
            );
            const subject = cycle1Subject || subjectData[0];

            const urlOptions: Partial<ResolveOakHrefProps> = {
              page: "pupil-unit-index",
              programmeSlug: subject.programmeSlug,
              ...(hasTierOrExamOptions && {
                page: "pupil-programme-index",
                optionSlug: "options",
              }),
            };

            return (
              <OakGridArea $colSpan={1} key={subjectSlug} role="listitem">
                <OakFlex $height={"100%"}>
                  <OakPupilJourneySubjectButton
                    key={subjectSlug}
                    element="a"
                    subjectIconName={`subject-${subject.programmeFields.subjectSlug}`}
                    href={resolveOakHref(urlOptions as ResolveOakHrefProps)}
                    phase={
                      subject.programmeFields.phaseSlug as
                        | "primary"
                        | "secondary"
                    }
                  >
                    {subject.programmeFields.subject}
                  </OakPupilJourneySubjectButton>
                </OakFlex>
              </OakGridArea>
            );
          })}
        </OakGrid>
      </OakFlex>
    </OakPupilJourneyLayout>
  );
};
