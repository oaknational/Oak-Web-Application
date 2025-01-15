import { GetStaticProps, GetStaticPropsResult } from "next";
import {
  LessonAttemptCamelCase,
  useOakPupil,
} from "@oaknational/oak-pupil-client";
import { useEffect, useState } from "react";
import {
  OakFlex,
  OakInlineBanner,
  OakLoadingSpinner,
  OakMaxWidth,
  OakTypography,
} from "@oaknational/oak-components";

import getPageProps from "@/node-lib/getPageProps";
import { getStaticPaths as getStaticPathsTemplate } from "@/pages-helpers/get-static-paths";
import curriculumApi2023 from "@/node-lib/curriculum-api-2023";
import {
  LessonBrowseData,
  LessonContent,
} from "@/node-lib/curriculum-api-2023/queries/pupilLesson/pupilLesson.schema";
import { MathJaxProvider } from "@/browser-lib/mathjax/MathJaxProvider";
import { PupilViewsResults } from "@/components/PupilViews/PupilResults";

export type CanonicalResultsPrintablePageProps = {
  browseData: LessonBrowseData;
  content: LessonContent;
  attemptId: string;
};

const CanonicalPrintableResultsPage = (
  props: CanonicalResultsPrintablePageProps,
) => {
  return <InnerRender {...props} />;
};

export const InnerRender = (props: CanonicalResultsPrintablePageProps) => {
  const { browseData, content, attemptId } = props;
  const { getAttempt } = useOakPupil();
  const [attemptData, setAttemptData] =
    useState<LessonAttemptCamelCase | null>();

  useEffect(() => {
    const setData = async (attemptId: string) => {
      const attemptData = await getAttempt(attemptId, true);
      setAttemptData(attemptData);
    };
    setData(attemptId);
  }, [attemptId, getAttempt]);

  if (!attemptData) {
    return (
      <OakMaxWidth $mt={"space-between-l"}>
        <OakInlineBanner
          isOpen
          message="To share lesson results with your teacher, select the 'Copy link' option on the lesson review page."
          type="neutral"
        />
        <OakFlex
          $justifyContent={"center"}
          $alignItems={"center"}
          $gap={"space-between-s"}
          $mt={"space-between-xxxl"}
        >
          {" "}
          <OakLoadingSpinner />
          <OakTypography $font={"body-1"}>
            Loading lesson results...
          </OakTypography>
        </OakFlex>
      </OakMaxWidth>
    );
  }
  return (
    <MathJaxProvider>
      <OakMaxWidth $mt={"space-between-l"}>
        <OakInlineBanner
          isOpen
          message="To share lesson results with your teacher, select the 'Copy link' option on the lesson review page."
          type="neutral"
        />
      </OakMaxWidth>

      <PupilViewsResults
        browseData={browseData}
        attemptData={attemptData}
        starterQuizQuestionsArray={content.starterQuiz}
        exitQuizQuestionsArray={content.exitQuiz}
      />
    </MathJaxProvider>
  );
};

type CanonicalPrintableResultsPageURLParams = {
  lessonSlug: string;
  attemptId: string;
};
export const getStaticPaths =
  getStaticPathsTemplate<CanonicalPrintableResultsPageURLParams>;

export const getStaticProps: GetStaticProps<
  CanonicalResultsPrintablePageProps,
  CanonicalPrintableResultsPageURLParams
> = async (context) => {
  return getPageProps({
    page: "pupil-canonical-results-printable::getStaticProps",
    context,
    getProps: async () => {
      if (!context.params) {
        throw new Error("no context.params");
      }
      const { lessonSlug, attemptId } = context.params;
      if (!lessonSlug || !attemptId) {
        throw new Error("unexpected context.params");
      }

      const { browseData, content } = await curriculumApi2023.pupilLessonQuery({
        lessonSlug,
      });

      const results: GetStaticPropsResult<CanonicalResultsPrintablePageProps> =
        {
          props: {
            browseData,
            content,
            attemptId,
          },
        };
      return results;
    },
  });
};

export default CanonicalPrintableResultsPage;
