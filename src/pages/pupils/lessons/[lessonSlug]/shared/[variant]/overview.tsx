import { ParsedUrlQuery } from "querystring";

import { useEffect, useState } from "react";
import { GetStaticProps, GetStaticPropsContext, PreviewData } from "next";
import { useRouter } from "next/router";
import { OakPupilContentGuidance } from "@oaknational/oak-components";
import { useShallow } from "zustand/react/shallow";

import getPageProps from "@/node-lib/getPageProps";
import { getStaticPaths as getStaticPathsTemplate } from "@/pages-helpers/get-static-paths";
import {
  getProps,
  PupilLessonPageURLParams,
} from "@/pages-helpers/pupil/lessons-pages/getProps";
import { PupilLayout } from "@/components/PupilComponents/PupilLayout/PupilLayout";
import { getSeoProps } from "@/browser-lib/seo/getSeoProps";
import { useAssignmentSearchParams } from "@/hooks/useAssignmentSearchParams";
import { ViewAllLessonsButton } from "@/components/PupilComponents/ViewAllLessonsButton/ViewAllLessonsButton";
import {
  ContentGuidanceTrackingArgs,
  PupilLessonOverviewContentGuidance,
  PupilLessonOverviewContentGuidanceModal,
  PupilLessonOverviewOutcomes,
  PupilLessonOverviewView,
} from "@/components/PupilComponents/Views/PupilLessonOverview";
import {
  buildOverviewSectionItems,
  getIsLessonExpiring,
  getNewLessonSectionHref,
  getInteractiveQuestions,
  getUnitListingHref,
  pickNextIncompleteSection,
  pickProceedToNextSectionLabel,
} from "@/components/PupilComponents/Views/ViewHelpers";
import {
  getDoesSubjectHaveNewUnits,
  TakedownBanner,
} from "@/components/SharedComponents/TakedownBanner/TakedownBanner";
import { usePupilLessonAnalytics } from "@/context/PupilLessonAnalytics/usePupilLessonAnalytics";
import { usePupilLessonProgress } from "@/context/PupilLessonProgress";
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
  const { isClassroomAssignment, classroomAssignmentChecked } =
    useAssignmentSearchParams();
  const {
    sectionResults,
    lessonReviewSections,
    isLessonComplete,
    lessonStarted,
    isReadOnly,
    isHydratingInitialProgress,
    contentGuidanceDismissed,
    markLessonStarted,
    dismissContentGuidance,
  } = usePupilLessonProgress(
    useShallow((state) => ({
      sectionResults: state.sectionResults,
      lessonReviewSections: state.lessonReviewSections,
      isLessonComplete: state.isLessonComplete,
      lessonStarted: state.lessonStarted,
      isReadOnly: state.isReadOnly,
      isHydratingInitialProgress: state.isHydratingInitialProgress,
      contentGuidanceDismissed: state.contentGuidanceDismissed,
      markLessonStarted: state.markLessonStarted,
      dismissContentGuidance: state.dismissContentGuidance,
    })),
  );
  const {
    trackSectionStarted,
    trackLessonStarted,
    trackLessonAbandoned,
    trackContentGuidanceAccepted,
    trackContentGuidanceDeclined,
  } = usePupilLessonAnalytics();
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);

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

  const {
    lessonTitle,
    pupilLessonOutcome,
    phonicsOutcome,
    contentGuidance,
    supervisionLevel,
  } = lessonContent;
  const [redirectOverlayCleared, setRedirectOverlayCleared] = useState(false);

  const unitListingHref = getUnitListingHref({
    subjectSlug: browseData.programmeFields.subjectSlug,
    phaseSlug: browseData.programmeFields.phaseSlug,
    yearSlug: browseData.programmeFields.yearSlug,
  });

  const handleProceedToNextSectionClick = () => {
    const nextSection = pickNextIncompleteSection({
      lessonReviewSections,
      sectionResults,
    });
    if (!lessonStarted) {
      trackLessonStarted();
    }
    markLessonStarted();
    trackSectionStarted({ section: nextSection, sectionResults });
    void router.push(
      getNewLessonSectionHref({
        currentRoute: router.asPath,
        section: nextSection,
        searchParams: new URLSearchParams(router.asPath.split("?")[1]),
      }),
    );
  };

  const starterQuizNumQuestions = getInteractiveQuestions(
    lessonContent.starterQuiz,
  ).length;
  const exitQuizNumQuestions = getInteractiveQuestions(
    lessonContent.exitQuiz,
  ).length;

  const sectionItems = buildOverviewSectionItems({
    lessonReviewSections,
    sectionResults,
    isReadOnly,
    isHydratingInitialProgress,
    starterQuizNumQuestions,
    exitQuizNumQuestions,
    onSectionClick: (section) => {
      if (!lessonStarted) {
        trackLessonStarted();
      }
      markLessonStarted();
      trackSectionStarted({ section, sectionResults });
    },
    getSectionHref: (section) =>
      getNewLessonSectionHref({
        currentRoute: router.asPath,
        section,
        searchParams: new URLSearchParams(router.asPath.split("?")[1]),
      }),
  });

  const lessonOutcomes = [pupilLessonOutcome, phonicsOutcome].filter(
    Boolean,
  ) as string[];

  const handleContentGuidanceAccept = (args: ContentGuidanceTrackingArgs) => {
    dismissContentGuidance();
    trackContentGuidanceAccepted(args);
  };

  const handleContentGuidanceDecline = (args: ContentGuidanceTrackingArgs) => {
    trackContentGuidanceDeclined(args);

    if (isClassroomAssignment) {
      globalThis.window?.parent?.postMessage(
        {
          type: "Classroom",
          action: "closeIframe",
        },
        "https://classroom.google.com",
      );
    } else if (backUrl) {
      void router.replace(backUrl);
    } else {
      router.back();
    }
  };

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <>
      <PupilLessonOverviewContentGuidanceModal
        redirectOverlayCleared={redirectOverlayCleared}
        contentGuidanceDismissed={contentGuidanceDismissed}
        contentGuidance={contentGuidance as OakPupilContentGuidance[] | null}
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
              onClick={() => {
                if (isLessonComplete === false) {
                  trackLessonAbandoned();
                }
              }}
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
              contentGuidance={contentGuidance as OakPupilContentGuidance[]}
              supervisionLevel={supervisionLevel}
            />
          ) : undefined
        }
        sectionsNav={{ items: sectionItems }}
        bottomNav={{
          proceedLabel: pickProceedToNextSectionLabel({
            lessonStarted,
            isLessonComplete,
            sectionResults,
          }),
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

const PupilLessonOverviewNewPage = (props: PupilLessonPageProps) => {
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

export default PupilLessonOverviewNewPage;

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
    page: "pupils-lesson-new-overview::getStaticProps",
    context: context as GetStaticPropsContext<ParsedUrlQuery, PreviewData>,
    getProps: getProps({ context: contextWithSection, page: "canonical" }),
  });
};
