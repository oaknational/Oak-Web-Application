import { GetStaticProps, GetStaticPropsContext, PreviewData } from "next";
import { OakImage, OakTertiaryButton } from "@oaknational/oak-components";

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
import { usePupilReviewExperience } from "@/components/PupilComponents/Views/Hooks";
import { PupilLessonPageProps } from "@/pages-helpers/pupil/lessons-pages/pupilLessonPage.types";

type ReviewPageURLParams = {
  lessonSlug: string;
};

const ReviewPageContent = ({
  browseData,
  lessonContent,
  backUrl,
}: Pick<PupilLessonPageProps, "browseData" | "lessonContent" | "backUrl">) => {
  const {
    isReadOnly,
    hasQuizSections,
    showBottomNav,
    overviewHref,
    isAttemptStored,
    isAttemptingShare,
    printableHref,
    reviewSections,
    finalFeedback,
    handleGoToOverview,
    handleCopyLink,
  } = usePupilReviewExperience({ browseData, lessonContent });

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
        isReadOnly ? undefined : (
          <OakTertiaryButton
            iconName="arrow-left"
            element="a"
            href={overviewHref}
            onClick={(event) => {
              event.preventDefault();
              handleGoToOverview();
            }}
          >
            Lesson overview
          </OakTertiaryButton>
        )
      }
      shareOptionsSlot={
        hasQuizSections && showBottomNav ? (
          <PupilLessonReviewShareOptions
            showPrintable={isAttemptStored}
            printableHref={printableHref}
            shareState={isAttemptingShare}
            onCopyLink={handleCopyLink}
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

const PupilLessonReviewPage = (props: PupilLessonPageProps) => {
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

export default PupilLessonReviewPage;

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
    page: "pupils-lesson-canonical-review::getStaticProps",
    context,
    getProps: getProps({ context: contextWithSection, page: "canonical" }),
  });
};
