import { ParsedUrlQuery } from "querystring";

import { useEffect, useMemo, useState } from "react";
import { GetStaticProps, GetStaticPropsContext, PreviewData } from "next";
import { useRouter } from "next/router";
import { OakImage, OakTertiaryButton } from "@oaknational/oak-components";
import { useShallow } from "zustand/react/shallow";

import getPageProps from "@/node-lib/getPageProps";
import { getStaticPaths as getStaticPathsTemplate } from "@/pages-helpers/get-static-paths";
import {
  getProps,
  PupilLessonPageURLParams,
} from "@/pages-helpers/pupil/lessons-pages/getProps";
import { PupilLayout } from "@/components/PupilComponents/PupilLayout/PupilLayout";
import { getSeoProps } from "@/browser-lib/seo/getSeoProps";
import {
  PupilLessonReviewBottomNav,
  PupilLessonReviewFeedbackCard,
  PupilLessonReviewSections,
  PupilLessonReviewShareOptions,
  PupilLessonReviewView,
} from "@/components/PupilComponents/Views/PupilLessonReview";
import {
  buildReviewAttemptData,
  buildReviewShareUrl,
  getHasQuizSections,
  getNewLessonSectionHref,
  shouldShowReviewBottomNav,
} from "@/components/PupilComponents/Views/ViewHelpers";
import { usePupilLessonProgress } from "@/context/PupilLessonProgress";
import { resolveOakHref } from "@/common-lib/urls";
import { useOakPupil } from "@/hooks/useOakPupil";
import { useAssignmentSearchParams } from "@/hooks/useAssignmentSearchParams";
import { getReviewSections } from "@/components/PupilComponents/Views/ViewHelpers/Review/getReviewSections";
import { getReviewFinalFeedback } from "@/components/PupilComponents/Views/ViewHelpers/Review/getReviewFinalFeedback";
import { PupilLessonPageProps } from "@/pages-helpers/pupil/lessons-pages/pupilLessonPage.types";
import { usePupilLessonAnalytics } from "@/context/PupilLessonAnalytics/usePupilLessonAnalytics";

type ReviewPageURLParams = {
  lessonSlug: string;
};

const ReviewPageContent = ({
  browseData,
  lessonContent,
  backUrl,
}: Pick<PupilLessonPageProps, "browseData" | "lessonContent" | "backUrl">) => {
  const router = useRouter();
  const { sectionResults, lessonReviewSections, isLessonComplete, isReadOnly } =
    usePupilLessonProgress(
      useShallow((state) => ({
        sectionResults: state.sectionResults,
        lessonReviewSections: state.lessonReviewSections,
        isLessonComplete: state.isLessonComplete,
        isReadOnly: state.isReadOnly,
      })),
    );
  const { isClassroomAssignment, classroomAssignmentChecked } =
    useAssignmentSearchParams();
  const { trackLessonSummaryReviewed, trackActivityResultsShared } =
    usePupilLessonAnalytics();
  const [trackingSent, setTrackingSent] = useState(false);
  const [isAttemptingShare, setIsAttemptingShare] = useState<
    "failed" | "shared" | "initial"
  >("initial");
  const [storedAttemptLocally, setStoredAttemptLocally] = useState<{
    stored: boolean;
    attemptId: string;
  }>({ stored: false, attemptId: "" });
  const pupilClient = useOakPupil();

  const hasQuizSections = getHasQuizSections(lessonReviewSections);
  const showBottomNav = shouldShowReviewBottomNav({
    classroomAssignmentChecked,
    isClassroomAssignment,
  });
  const currentSearchParams = useMemo(
    () => new URLSearchParams(router.asPath.split("?")[1]),
    [router.asPath],
  );

  const finalFeedback = useMemo(
    () => getReviewFinalFeedback(isLessonComplete, sectionResults),
    [isLessonComplete, sectionResults],
  );

  useEffect(() => {
    if (storedAttemptLocally.stored || !isLessonComplete) return;

    const attemptData = buildReviewAttemptData({
      lessonSlug: browseData.lessonSlug,
      lessonTitle: lessonContent.lessonTitle ?? "",
      subject: browseData.programmeFields.subject,
      yearDescription: browseData.programmeFields.yearDescription,
      sectionResults,
    });
    const attemptId = pupilClient.logAttempt(attemptData, true);

    if (typeof attemptId === "string") {
      setStoredAttemptLocally({ stored: true, attemptId });
    }
  }, [
    browseData.lessonSlug,
    browseData.programmeFields.subject,
    browseData.programmeFields.yearDescription,
    isLessonComplete,
    lessonContent.lessonTitle,
    pupilClient,
    sectionResults,
    storedAttemptLocally.stored,
  ]);

  useEffect(() => {
    if (trackingSent || !isLessonComplete) return;
    trackLessonSummaryReviewed({ sectionResults });
    setTrackingSent(true);
  }, [
    isLessonComplete,
    sectionResults,
    trackLessonSummaryReviewed,
    trackingSent,
  ]);

  useEffect(() => {
    if (!isLessonComplete) {
      void router.push(
        getNewLessonSectionHref({
          currentRoute: router.asPath,
          section: "overview",
          searchParams: currentSearchParams,
        }),
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLessonComplete]);

  const reviewSections = getReviewSections(
    lessonContent,
    lessonReviewSections,
    sectionResults,
  );

  const printableHref = storedAttemptLocally.stored
    ? resolveOakHref({
        page: "pupil-lesson-results-canonical-printable",
        lessonSlug: browseData.lessonSlug,
        attemptId: storedAttemptLocally.attemptId,
      })
    : undefined;

  return (
    <PupilLessonReviewView
      phase={browseData.programmeFields.phase as "primary" | "secondary"}
      lessonTitle={lessonContent.lessonTitle ?? ""}
      bottomNavSlot={
        showBottomNav ? (
          <PupilLessonReviewBottomNav href={backUrl ?? undefined} />
        ) : undefined
      }
      overviewButtonSlot={
        !isReadOnly ? (
          <OakTertiaryButton
            iconName="arrow-left"
            element="a"
            href={getNewLessonSectionHref({
              currentRoute: router.asPath,
              section: "overview",
              searchParams: currentSearchParams,
            })}
            onClick={(event) => {
              event.preventDefault();
              void router.push(
                getNewLessonSectionHref({
                  currentRoute: router.asPath,
                  section: "overview",
                  searchParams: currentSearchParams,
                }),
              );
            }}
          >
            Lesson overview
          </OakTertiaryButton>
        ) : undefined
      }
      shareOptionsSlot={
        hasQuizSections && showBottomNav ? (
          <PupilLessonReviewShareOptions
            showPrintable={storedAttemptLocally.stored}
            printableHref={printableHref}
            shareState={isAttemptingShare}
            onCopyLink={() => {
              const attemptData = buildReviewAttemptData({
                lessonSlug: browseData.lessonSlug,
                lessonTitle: lessonContent.lessonTitle ?? "",
                subject: browseData.programmeFields.subject,
                yearDescription: browseData.programmeFields.yearDescription,
                sectionResults,
              });
              const res = pupilClient.logAttempt(attemptData, false);

              if (typeof res === "string") {
                void navigator.clipboard.writeText(
                  buildReviewShareUrl({
                    lessonSlug: browseData.lessonSlug,
                    attemptId: res,
                  }),
                );
                trackActivityResultsShared({ sectionResults });
                setIsAttemptingShare("shared");
                return;
              }

              void navigator.clipboard.writeText(
                buildReviewShareUrl({
                  lessonSlug: browseData.lessonSlug,
                  attemptId: res.attemptId,
                }),
              );
              trackActivityResultsShared({ sectionResults });
              setIsAttemptingShare("shared");
              res.promise.catch(() => {
                setIsAttemptingShare("failed");
              });
            }}
          />
        ) : undefined
      }
      illustrationSlot={
        <OakImage
          $display={["none", "none", "block"]}
          $height="spacing-240"
          alt="Review illustration"
          src={`https://${process.env.NEXT_PUBLIC_OAK_ASSETS_HOST}/${process.env.NEXT_PUBLIC_OAK_ASSETS_PATH}/v1699887218/svg-illustrations/xrazqgtjmbdf1clz8wic`}
        />
      }
      sectionSummarySlot={<PupilLessonReviewSections items={reviewSections} />}
      feedbackSlot={<PupilLessonReviewFeedbackCard feedback={finalFeedback} />}
    />
  );
};

const PupilLessonReviewNewPage = (props: PupilLessonPageProps) => {
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
      <ReviewPageContent
        browseData={browseData}
        lessonContent={lessonContent}
        backUrl={backUrl}
      />
    </PupilLayout>
  );
};

export default PupilLessonReviewNewPage;

export const getStaticPaths = getStaticPathsTemplate<ReviewPageURLParams>;

export const getStaticProps: GetStaticProps<
  PupilLessonPageProps,
  ReviewPageURLParams
> = async (context) => {
  const contextWithSection = {
    ...context,
    params: context.params
      ? {
          ...context.params,
          section: "review",
        }
      : undefined,
  } as GetStaticPropsContext<PupilLessonPageURLParams, PreviewData>;

  return getPageProps({
    page: "pupils-lesson-new-review::getStaticProps",
    context: context as GetStaticPropsContext<ParsedUrlQuery, PreviewData>,
    getProps: getProps({ context: contextWithSection, page: "canonical" }),
  });
};
