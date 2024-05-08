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
  OakPupilJourneyList,
} from "@oaknational/oak-components";

import { resolveOakHref } from "@/common-lib/urls";
import { LessonListingBrowseData } from "@/node-lib/curriculum-api-2023/queries/pupilLessonListing/pupilLessonListing.schema";
import AppLayout from "@/components/SharedComponents/AppLayout";
import { getSeoProps } from "@/browser-lib/seo/getSeoProps";

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
      Change unit
    </OakTertiaryButton>
  );

  return (
    <OakThemeProvider theme={oakDefaultTheme}>
      {" "}
      <AppLayout
        seoProps={{
          ...getSeoProps({
            title: `${subject}, ${phase}, ${yearDescription} - Lesson listing`,
            description: `Lesson listing for ${subject}, ${phase}, ${yearDescription}`,
          }),
        }}
      >
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
              Lessons
              <OakSpan
                $font={"heading-light-6"}
              >{` (${orderedCurriculumData.length})`}</OakSpan>
            </OakHeading>
          </OakFlex>
          <OakPupilJourneyList phase={phase}>
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
          </OakPupilJourneyList>
        </OakPupilJourneyLayout>
      </AppLayout>
    </OakThemeProvider>
  );
};
