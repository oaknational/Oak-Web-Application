import {
  OakFlex,
  OakInfo,
  OakPupilJourneyHeader,
  OakPupilJourneyLayout,
  OakPupilJourneyListItem,
  OakTertiaryButton,
  OakPupilJourneyList,
  OakPupilJourneyListCounter,
  OakBox,
  isValidIconName,
} from "@oaknational/oak-components";

import { resolveOakHref } from "@/common-lib/urls";
import { LessonListingBrowseData } from "@/node-lib/curriculum-api-2023/queries/pupilLessonListing/pupilLessonListing.schema";
import AppLayout from "@/components/SharedComponents/AppLayout";
import { getSeoProps } from "@/browser-lib/seo/getSeoProps";
import { PupilRedirectedOverlay } from "@/components/PupilComponents/PupilRedirectedOverlay/PupilRedirectedOverlay";
import { TopNavProps } from "@/components/AppComponents/TopNav/TopNav";
import {
  getDoesSubjectHaveNewUnits,
  TakedownBanner,
} from "@/components/SharedComponents/TakedownBanner/TakedownBanner";
import isSlugLegacy from "@/utils/slugModifiers/isSlugLegacy";

export type PupilLessonListingViewProps = {
  unitData: LessonListingBrowseData[number]["unitData"];
  programmeFields: LessonListingBrowseData[number]["programmeFields"];
  orderedCurriculumData: LessonListingBrowseData;
  programmeSlug: string;
  backLink: string;
  topNav: TopNavProps;
};

export const PupilViewsLessonListing = (props: PupilLessonListingViewProps) => {
  const {
    unitData,
    programmeFields,
    orderedCurriculumData,
    backLink,
    topNav,
    programmeSlug,
  } = props;
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
    <OakFlex $flexDirection={"column"} $gap={"spacing-24"} $width={"100%"}>
      <OakFlex $alignItems={"center"} $gap={"spacing-12"}>
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

      <TakedownBanner
        isExpiring={
          unitData.expirationDate !== null ||
          orderedCurriculumData.some((c) => c.actions?.displayExpiringBanner)
        }
        isLegacy={isSlugLegacy(programmeSlug)}
        hasNewUnits={getDoesSubjectHaveNewUnits(subjectSlug)}
        subjectSlug={subjectSlug}
        userType="pupil"
        onwardHref={unitListingHref}
      />
    </OakFlex>
  );

  return (
    <>
      {" "}
      <AppLayout
        seoProps={{
          ...getSeoProps({
            title: `${subject}, ${phaseSlug}, ${yearDescription} - Lesson listing`,
            description: `Lesson listing for ${subject}, ${phaseSlug}, ${yearDescription}`,
          }),
          noIndex: true,
          noFollow: false,
        }}
        topNavProps={topNav}
      >
        {" "}
        <OakPupilJourneyLayout
          sectionName={"lesson-listing"}
          phase={phaseSlug}
          topNavSlot={BacktoUnits}
        >
          <OakBox $mb={"spacing-56"}>
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
          <PupilRedirectedOverlay />
        </OakPupilJourneyLayout>
      </AppLayout>
    </>
  );
};
