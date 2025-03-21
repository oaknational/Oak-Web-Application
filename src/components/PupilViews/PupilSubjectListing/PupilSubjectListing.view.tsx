import { groupBy } from "lodash";
import {
  isValidIconName,
  OakFlex,
  OakGrid,
  OakGridArea,
  OakHeading,
  OakPupilJourneyLayout,
  OakPupilJourneySubjectButton,
  OakTertiaryButton,
} from "@oaknational/oak-components";
import { yearDescriptions } from "@oaknational/oak-curriculum-schema";

import { ResolveOakHrefProps, resolveOakHref } from "@/common-lib/urls";
import { PupilSubjectListingData } from "@/node-lib/curriculum-api-2023/queries/pupilSubjectListing/pupilSubjectListing.schema";
import SignpostTeachersInlineBanner from "@/components/PupilComponents/SignpostTeachersInlineBanner/SignpostTeachersInlineBanner";
import useAnalytics from "@/context/Analytics/useAnalytics";
import { PupilSubjectListingQuery } from "@/node-lib/curriculum-api-2023/generated/sdk";

type PupilViewsSubjectListingProps = {
  subjects: PupilSubjectListingData[];
  subjectFeatures?: PupilSubjectListingQuery["subjectFeatures"];
};

export const PupilViewsSubjectListing = ({
  subjects,
  subjectFeatures = [],
}: PupilViewsSubjectListingProps) => {
  const { track } = useAnalytics();
  const groupedBySubject = groupBy(
    subjects,
    (subject) => subject.programmeFields.subjectSlug,
  );

  const orderedKeys = Object.keys(groupedBySubject).sort((a, b) =>
    a.localeCompare(b),
  );

  const nonCurriculum = orderedKeys.filter((subjectSlug) =>
    subjectFeatures.find(
      (feature) =>
        feature.slug === subjectSlug && feature.features.non_curriculum,
    ),
  );

  const buildSubjectGridArea = ({
    subjectSlug,
    showNonCurriculum = false,
  }: {
    subjectSlug: string;
    showNonCurriculum: boolean;
  }) => {
    const subjectData = groupedBySubject[subjectSlug];
    const features = subjectFeatures.find(
      (feature) => feature.slug === subjectSlug,
    )?.features;

    if (
      features?.non_curriculum &&
      features?.non_curriculum !== showNonCurriculum
    ) {
      return null;
    }
    if (subjectData?.[0]?.programmeFields.phaseSlug === "foundation") {
      throw new Error("Foundation phase is not supported");
    }
    if (!subjectData?.[0]) {
      throw new Error(`Error no subject data available for ${subjectSlug}`);
    }

    const examOptions = groupBy(
      subjectData,
      (subject) => subject.programmeFields.examboardSlug,
    );
    const tierOptions = groupBy(
      subjectData,
      (subject) => subject.programmeFields.tierSlug,
    );
    const pathwayOptions = groupBy(
      subjectData,
      (subject) => subject.programmeFields.pathwaySlug,
    );

    const hasOptions =
      Object.keys(examOptions).length > 1 ||
      Object.keys(tierOptions).length > 1 ||
      Object.keys(pathwayOptions).length > 1;

    // If there are multiple matches on subjectSlug, show the non-legacy one.
    const cycle1Subject = subjectData.find((subject) => !subject.isLegacy);
    const subject = cycle1Subject || subjectData[0];

    const urlOptions: Partial<ResolveOakHrefProps> = {
      page: "pupil-unit-index",
      programmeSlug: hasOptions ? subject.baseSlug : subject.programmeSlug,
      ...(hasOptions && {
        page: "pupil-programme-index",
        optionSlug: "options",
      }),
    };

    const iconSlug = `subject-${subject.programmeFields.subjectSlug}`;
    return (
      <OakGridArea $colSpan={1} key={subjectSlug} role="listitem">
        <OakFlex $height={"100%"}>
          <OakPupilJourneySubjectButton
            key={subjectSlug}
            element="a"
            subjectIconName={
              isValidIconName(iconSlug) ? iconSlug : "question-mark"
            }
            href={resolveOakHref(urlOptions as ResolveOakHrefProps)}
            phase={subject.programmeFields.phaseSlug as "primary" | "secondary"}
            onClick={() => {
              track.browseRefined({
                platform: "owa",
                product: "pupil lesson activities",
                engagementIntent: "use",
                eventVersion: "2.0.0",
                componentType: "subject_card",
                analyticsUseCase: "Pupil",
                filterType: "Subject filter",
                filterValue: subject.programmeFields.subject,
                activeFilters: { yearDescriptions },
              });
            }}
          >
            {subject.programmeFields.subject}
          </OakPupilJourneySubjectButton>
        </OakFlex>
      </OakGridArea>
    );
  };

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
      <OakFlex $flexDirection="column" $pb="inner-padding-xl2">
        <OakFlex
          $background={"bg-primary"}
          $pt={["inner-padding-xl5", "inner-padding-xl7"]}
          $ph={["inner-padding-l", "inner-padding-xl"]}
          $borderRadius={"border-radius-l"}
          $ba={"border-solid-s"}
          $borderColor={"border-decorative1-stronger"}
          $mb={"space-between-m2"}
          $flexDirection={"column"}
          $alignItems={"center"}
        >
          <OakHeading $font={["heading-6", "heading-5"]} tag="h1">
            Now choose a subject
          </OakHeading>
          <OakGrid
            $mt={"space-between-l"}
            $pb={"inner-padding-xl4"}
            $gridTemplateColumns={[
              "repeat(2, 1fr)",
              "repeat(4, 1fr)",
              "repeat(5, 1fr)",
            ]}
            $rg={"space-between-s"}
            $cg={"space-between-s"}
            role="list"
          >
            {orderedKeys.map((subjectSlug) =>
              buildSubjectGridArea({ subjectSlug, showNonCurriculum: false }),
            )}
          </OakGrid>
          {nonCurriculum.length > 0 && (
            <>
              <OakHeading $font={["heading-6", "heading-5"]} tag="h2">
                Further lessons
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
                {nonCurriculum.map((subjectSlug) =>
                  buildSubjectGridArea({
                    subjectSlug,
                    showNonCurriculum: true,
                  }),
                )}
              </OakGrid>
            </>
          )}
        </OakFlex>
        <SignpostTeachersInlineBanner />
      </OakFlex>
    </OakPupilJourneyLayout>
  );
};
