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

import { resolveOakHref } from "@/common-lib/urls";
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
        <OakHeading $font={"heading-5"} tag="h1">
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

            if (subjectData?.[0]) {
              if (subjectData?.length === 1) {
                return (
                  <OakGridArea $colSpan={1} key={subjectSlug} role="listitem">
                    <OakFlex $height={"100%"}>
                      <OakPupilJourneySubjectButton
                        href={resolveOakHref({
                          page: "pupil-unit-index",
                          programmeSlug: subjectData[0].programmeSlug,
                        })}
                        element="a"
                        subjectIconName={`subject-${subjectData[0].programmeFields.subjectSlug}`}
                        phase={subjectData[0].programmeFields.phaseSlug}
                      >
                        {subjectData[0].programmeFields.subject}
                      </OakPupilJourneySubjectButton>
                    </OakFlex>
                  </OakGridArea>
                );
              }

              return (
                <OakGridArea $colSpan={1} key={subjectSlug} role="listitem">
                  <OakFlex $height={"100%"}>
                    <OakPupilJourneySubjectButton
                      key={subjectSlug}
                      element="a"
                      subjectIconName={`subject-${subjectData[0].programmeFields.subjectSlug}`}
                      href={resolveOakHref({
                        page: "pupil-programme-index",
                        programmeSlug: subjectData[0].baseSlug,
                        optionSlug: subjectData[0].isLegacy
                          ? "options-l"
                          : "options",
                      })}
                      phase={subjectData[0].programmeFields.phaseSlug}
                    >
                      {subjectData[0].programmeFields.subject}
                    </OakPupilJourneySubjectButton>
                  </OakFlex>
                </OakGridArea>
              );
            }
          })}
        </OakGrid>
      </OakFlex>
    </OakPupilJourneyLayout>
  );
};
