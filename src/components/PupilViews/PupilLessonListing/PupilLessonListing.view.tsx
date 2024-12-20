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
  isValidIconName,
} from "@oaknational/oak-components";
import { useState } from "react";

import { resolveOakHref } from "@/common-lib/urls";
import { LessonListingBrowseData } from "@/node-lib/curriculum-api-2023/queries/pupilLessonListing/pupilLessonListing.schema";
import AppLayout from "@/components/SharedComponents/AppLayout";
import { getSeoProps } from "@/browser-lib/seo/getSeoProps";
import { ExpiringBanner } from "@/components/SharedComponents/ExpiringBanner";

export type PupilLessonListingViewProps = {
  unitData: LessonListingBrowseData[number]["unitData"];
  programmeFields: LessonListingBrowseData[number]["programmeFields"];
  orderedCurriculumData: LessonListingBrowseData;
  programmeSlug: string;
  backLink: string;
};

export const PupilViewsLessonListing = (props: PupilLessonListingViewProps) => {
  const { unitData, programmeFields, orderedCurriculumData, backLink } = props;
  const {
    yearDescription,
    yearSlug,
    subject,
    subjectSlug,
    tierDescription,
    pathway,
    examboard,
    phaseSlug,
  } = programmeFields;

  const [showExpiredLessonsBanner, setShowExpiredLessonsBanner] =
    useState<boolean>(
      unitData.expirationDate !== null ||
        orderedCurriculumData.some((c) => c.actions?.displayExpiringBanner),
    );

  const baseSlug = `${subjectSlug}-${phaseSlug}-${yearSlug}`;
  const unitListingHref = `/pupils/programmes/${baseSlug}/options`; // NB. options will forward to units if no options available

  const noneExpiredLessons = orderedCurriculumData.filter(
    (lesson) => !lesson.lessonData?.deprecatedFields?.expired,
  );

  if (phaseSlug === "foundation") {
    throw new Error("Foundation phase is not supported");
  }

  const breadcrumb: string[] = [yearDescription, subject];

  if (pathway) {
    breadcrumb.push(pathway);
  }

  if (examboard) {
    breadcrumb.push(examboard);
  }
  if (tierDescription) {
    breadcrumb.push(tierDescription);
  }

  const optionality = programmeFields?.optionality;

  const iconSlug = `subject-${subjectSlug}`;

  const LessonListingTitle = (
    <OakPupilJourneyHeader
      iconBackground={phaseSlug}
      iconName={isValidIconName(iconSlug) ? iconSlug : "question-mark"}
      title={optionality ?? unitData?.title}
      breadcrumbs={breadcrumb}
      optionalityTitle={optionality && unitData?.title}
    />
  );

  const BacktoUnits = (
    <OakTertiaryButton iconName="arrow-left" href={backLink} element="a">
      Change unit
    </OakTertiaryButton>
  );

  const lessonCount = (
    <OakFlex $flexDirection={"column"} $gap={"space-between-m"} $width={"100%"}>
      <OakFlex $alignItems={"center"} $gap={"space-between-xs"}>
        <OakInfo
          id="lesson-listing-info"
          tooltipPosition="top-left"
          hint={
            "We've put the lessons in order helping you build on what you've learned before so it’s best to start with the first lesson of a unit."
          }
        />
        <OakPupilJourneyListCounter
          count={noneExpiredLessons.length}
          countHeader="Choose a lesson"
          tag="h2"
        />
      </OakFlex>

      <ExpiringBanner
        isOpen={showExpiredLessonsBanner}
        isResourcesMessage={false}
        onwardHref={unitListingHref}
        onClose={() => {
          setShowExpiredLessonsBanner(false);
        }}
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
              subheadingSlot={lessonCount}
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
                    key={index}
                    title={lesson.lessonData.title}
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
