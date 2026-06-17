import { GetStaticProps, GetStaticPropsContext, PreviewData } from "next";

import getPageProps from "@/node-lib/getPageProps";
import { getStaticPaths as getStaticPathsTemplate } from "@/pages-helpers/get-static-paths";
import {
  getProps,
  PupilLessonPageURLParams,
} from "@/pages-helpers/pupil/lessons-pages/getProps";
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

type OverviewPageURLParams = {
  lessonSlug: string;
};

const OverviewPageContent = ({
  browseData,
  lessonContent,
  backUrl,
}: Pick<PupilLessonPageProps, "browseData" | "lessonContent" | "backUrl">) => {
  const {
    isClassroomAssignment,
    classroomAssignmentChecked,
    contentGuidanceDismissed,
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

const PupilLessonOverviewPage = (props: PupilLessonPageProps) => {
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
      <OverviewPageContent
        browseData={browseData}
        lessonContent={lessonContent}
        backUrl={backUrl}
      />
    </PupilLayout>
  );
};

export default PupilLessonOverviewPage;

export const getStaticPaths = getStaticPathsTemplate<OverviewPageURLParams>;

export const getStaticProps: GetStaticProps<
  PupilLessonPageProps,
  OverviewPageURLParams
> = async (context) => {
  const contextWithSection = {
    ...context,
    params: context.params
      ? {
          ...context.params,
          section: "overview",
        }
      : undefined,
  } as GetStaticPropsContext<PupilLessonPageURLParams, PreviewData>;

  return getPageProps({
    page: "pupils-lesson-preview-overview::getStaticProps",
    context,
    getProps: getProps({ context: contextWithSection, page: "preview" }),
  });
};
