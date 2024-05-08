import {
  OakFlex,
  OakHeading,
  OakInfo,
  OakPupilJourneyHeader,
  OakPupilJourneyLayout,
  OakPupilJourneyListItem,
  OakSpan,
  OakTertiaryButton,
  OakThemeProvider,
  oakDefaultTheme,
} from "@oaknational/oak-components";

import { resolveOakHref } from "@/common-lib/urls";
import { LessonListingBrowseData } from "@/node-lib/curriculum-api-2023/queries/pupilLessonListing/pupilLessonListing.schema";

export type PupilLessonListingViewProps = {
  unitData: LessonListingBrowseData[number]["unitData"];
  programmeFields: LessonListingBrowseData[number]["programmeFields"];
  orderedCurriculumData: LessonListingBrowseData;
  programmeSlug: string;
};

export const PupilViewsLessonListing = (props: PupilLessonListingViewProps) => {
  const { unitData, programmeFields, orderedCurriculumData, programmeSlug } =
    props;
  const {
    yearDescription,
    subject,
    subjectSlug,
    tierDescription,
    examboardDescription,
    phaseSlug,
  } = programmeFields;
  const phase = phaseSlug === "primary" ? "primary" : "secondary";

  const breadcrumb: string[] = [yearDescription, subject];
  if (tierDescription) {
    breadcrumb.push(tierDescription);
  }
  if (examboardDescription) {
    breadcrumb.push(examboardDescription);
  }

  const LessonListingTitle = (
    <OakPupilJourneyHeader
      iconBackground={phase}
      iconName={`subject-${subjectSlug}`}
      title={unitData?.title}
      breadcrumbs={breadcrumb}
    />
  );

  const BacktoUnits = (
    <OakTertiaryButton
      iconName="arrow-left"
      href={resolveOakHref({
        page: "pupil-unit-index",
        programmeSlug: programmeSlug,
      })}
      element="a"
    >
      Change units
    </OakTertiaryButton>
  );

  return (
    <OakThemeProvider theme={oakDefaultTheme}>
      {" "}
      <OakPupilJourneyLayout
        sectionName={"lesson-listing"}
        titleSlot={LessonListingTitle}
        phase={phase}
        topNavSlot={BacktoUnits}
      >
        <OakFlex $alignItems={"center"} $gap={"space-between-xs"}>
          <OakInfo
            tooltipPosition="top-left"
            hint={
              "We've put the lessons in order helping you build on what you've learned before so it’s best to start with the first lesson of a unit."
            }
          />
          <OakHeading tag="h2" $font={["heading-6", "heading-6"]}>
            lessons
            <OakSpan
              $font={"heading-light-6"}
            >{` (${orderedCurriculumData.length})`}</OakSpan>
          </OakHeading>
        </OakFlex>

        <OakFlex
          $flexDirection={"column"}
          $gap={"space-between-s"}
          $background={
            phase === "secondary"
              ? "bg-decorative3-subdued"
              : "bg-decorative4-subdued"
          }
          $pa={"inner-padding-m"}
          $borderRadius={"border-radius-l"}
        >
          {orderedCurriculumData.map((lesson, index) => {
            const lessonData = lesson.lessonData;
            return (
              <OakPupilJourneyListItem
                href={resolveOakHref({
                  page: "pupil-lesson",
                  lessonSlug: lesson.lessonSlug,
                  programmeSlug: lesson.programmeSlug,
                  unitSlug: lesson.unitSlug,
                })}
                index={index + 1}
                title={lessonData.title}
              />
            );
          })}
        </OakFlex>
      </OakPupilJourneyLayout>
    </OakThemeProvider>
  );
};
