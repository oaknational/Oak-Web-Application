import { PupilLayout } from "@/components/PupilComponents/PupilLayout/PupilLayout";
import { getSeoProps } from "@/browser-lib/seo/getSeoProps";
import { ViewAllLessonsButton } from "@/components/PupilComponents/ViewAllLessonsButton/ViewAllLessonsButton";
import {
  PupilLessonOverviewContentGuidance,
  PupilLessonOverviewContentGuidanceModal,
  PupilLessonOverviewOutcomes,
  PupilLessonOverviewView,
} from "@/components/PupilComponents/Views/PupilLessonOverview";
import { getIsLessonExpiring } from "@/components/PupilComponents/Views/ViewHelpers";
import { usePupilOverviewExperience } from "@/components/PupilComponents/Views/Hooks";
import {
  getDoesSubjectHaveNewUnits,
  TakedownBanner,
} from "@/components/SharedComponents/TakedownBanner/TakedownBanner";
import isSlugLegacy from "@/utils/slugModifiers/isSlugLegacy";
import { PupilLessonPageProps } from "@/pages-helpers/pupil/lessons-pages/pupilLessonPage.types";
import { PupilRedirectedOverlay } from "@/components/PupilComponents/PupilRedirectedOverlay/PupilRedirectedOverlay";

const OverviewContent = ({
  browseData,
  lessonContent,
  backUrl,
}: Pick<PupilLessonPageProps, "browseData" | "lessonContent" | "backUrl">) => {
  const {
    isClassroomAssignment,
    classroomAssignmentChecked,
    contentGuidanceDismissed,
    contentGuidanceCanOpen,
    isMounted,
    redirectOverlayCleared,
    setRedirectOverlayCleared,
    unitListingHref,
    sectionItems,
    lessonOutcomes,
    proceedLabel,
    handleProceedToNextSectionClick,
    handleContentGuidanceAccept,
    handleContentGuidanceDecline,
    handleViewAllLessonsClick,
  } = usePupilOverviewExperience({ browseData, lessonContent, backUrl });

  const {
    programmeFields: {
      phase = "primary",
      subjectSlug,
      yearDescription,
      subject,
    },
    lessonData: { expirationDate },
    programmeSlug,
    actions,
  } = browseData;

  const { lessonTitle, contentGuidance, supervisionLevel } = lessonContent;

  return (
    <>
      <PupilLessonOverviewContentGuidanceModal
        redirectOverlayCleared={redirectOverlayCleared}
        contentGuidanceDismissed={contentGuidanceDismissed}
        contentGuidanceCanOpen={contentGuidanceCanOpen}
        contentGuidance={contentGuidance}
        supervisionLevel={supervisionLevel}
        ageRestriction={browseData.features?.ageRestriction}
        isClassroomAssignment={isClassroomAssignment}
        onAccept={handleContentGuidanceAccept}
        onDecline={handleContentGuidanceDecline}
      />
      <PupilLessonOverviewView
        phase={phase as "primary" | "secondary"}
        backButtonSlot={
          classroomAssignmentChecked && !isClassroomAssignment ? (
            <ViewAllLessonsButton
              href={backUrl}
              onClick={handleViewAllLessonsClick}
            />
          ) : undefined
        }
        bannerSlot={
          <TakedownBanner
            isExpiring={getIsLessonExpiring({
              expirationDate,
              displayExpiringBanner: actions?.displayExpiringBanner,
            })}
            isLegacy={isSlugLegacy(programmeSlug)}
            hasNewUnits={getDoesSubjectHaveNewUnits(subjectSlug)}
            subjectSlug={subjectSlug}
            userType="pupil"
            onwardHref={unitListingHref}
            isSingle
          />
        }
        header={{
          lessonTitle: lessonTitle ?? "",
          yearDescription,
          subject,
          subjectSlug,
          phase: phase as "primary" | "secondary",
        }}
        outcomesSlot={
          lessonOutcomes.length > 0 ? (
            <PupilLessonOverviewOutcomes outcomes={lessonOutcomes} />
          ) : undefined
        }
        contentGuidanceSlot={
          contentGuidance && contentGuidance.length > 0 ? (
            <PupilLessonOverviewContentGuidance
              contentGuidance={contentGuidance}
              supervisionLevel={supervisionLevel}
            />
          ) : undefined
        }
        sectionsNav={{ items: sectionItems }}
        bottomNav={{
          proceedLabel,
          onProceed: handleProceedToNextSectionClick,
          disabled: !isMounted,
        }}
      />
      <PupilRedirectedOverlay
        isLessonPage={true}
        onLoaded={(isShowing) => setRedirectOverlayCleared(!isShowing)}
        onClose={() => setRedirectOverlayCleared(true)}
      />
    </>
  );
};

/**
 * Overview page shared by the canonical, browse and preview pupil lesson
 * routes.
 */
const OverviewPageContent = (props: PupilLessonPageProps) => {
  const { browseData, lessonContent, backUrl, variant } = props;

  return (
    <PupilLayout
      seoProps={{
        ...getSeoProps({
          title: browseData.lessonData.title,
          description: browseData.lessonData.pupilLessonOutcome,
        }),
        noIndex: true,
      }}
      pupilStores={{ browseData, lessonContent, variant }}
    >
      <OverviewContent
        browseData={browseData}
        lessonContent={lessonContent}
        backUrl={backUrl}
      />
    </PupilLayout>
  );
};

export default OverviewPageContent;
