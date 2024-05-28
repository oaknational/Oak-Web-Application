import {
  OakFlex,
  OakInfo,
  OakPupilJourneyHeader,
  OakPupilJourneyLayout,
  OakPupilJourneyListItem,
  OakTertiaryButton,
  OakThemeProvider,
  oakDefaultTheme,
  OakPupilJourneyList,
  OakPupilJourneyListCounter,
  OakBox,
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

  if (phaseSlug === "foundation") {
    throw new Error("Foundation phase is not supported");
  }

  const breadcrumb: string[] = [yearDescription, subject];
  if (examboardDescription) {
    breadcrumb.push(examboardDescription);
  }
  if (tierDescription) {
    breadcrumb.push(tierDescription);
  }

  const LessonListingTitle = (
    <OakPupilJourneyHeader
      iconBackground={phaseSlug}
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

  const lessonCount = (
    <OakFlex $alignItems={"center"} $gap={"space-between-xs"}>
      <OakInfo
        tooltipPosition="top-left"
        hint={
          "We've put the lessons in order helping you build on what you've learned before so it’s best to start with the first lesson of a unit."
        }
      />
      <OakPupilJourneyListCounter
        count={orderedCurriculumData.length}
        countHeader="Lessons"
        tag="h2"
      />
    </OakFlex>
  );

  return (
    <OakThemeProvider theme={oakDefaultTheme}>
      {" "}
      <AppLayout
        seoProps={{
          ...getSeoProps({
            title: `${subject}, ${phaseSlug}, ${yearDescription} - Lesson listing`,
            description: `Lesson listing for ${subject}, ${phaseSlug}, ${yearDescription}`,
          }),
          ...{ noFollow: true, noIndex: true },
        }}
      >
        {" "}
        <OakPupilJourneyLayout
          sectionName={"lesson-listing"}
          phase={phaseSlug}
          topNavSlot={BacktoUnits}
        >
          <OakBox $mb={"space-between-xl"}>
            {" "}
            <OakPupilJourneyList
              titleSlot={LessonListingTitle}
              phase={phaseSlug}
              counterSlot={lessonCount}
            >
              {orderedCurriculumData.map((lesson, index) => {
                return (
                  <OakPupilJourneyListItem
                    href={resolveOakHref({
                      page: "pupil-lesson",
                      lessonSlug: lesson.lessonSlug,
                      programmeSlug: lesson.programmeSlug,
                      unitSlug: lesson.unitSlug,
                    })}
                    index={index + 1}
                    title={lesson.lessonData.title}
                    role="listitem"
                    unavailable={!!lesson.lessonData?.deprecatedFields?.expired}
                  />
                );
              })}
            </OakPupilJourneyList>
          </OakBox>
        </OakPupilJourneyLayout>
      </AppLayout>
    </OakThemeProvider>
  );
};
