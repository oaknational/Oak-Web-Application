import {
  LessonAttemptCamelCase,
  NetworkClient,
} from "@oaknational/oak-pupil-client";
import { GetServerSideProps, GetServerSidePropsResult } from "next";

import getBrowserConfig from "@/browser-lib/getBrowserConfig";
import { MathJaxProvider } from "@/browser-lib/mathjax/MathJaxProvider";
import { PupilViewsResults } from "@/components/PupilViews/PupilResults";
import curriculumApi2023 from "@/node-lib/curriculum-api-2023";
import {
  LessonBrowseData,
  LessonContent,
} from "@/node-lib/curriculum-api-2023/queries/pupilLesson/pupilLesson.schema";
import getPageProps from "@/node-lib/getPageProps";
import keysToCamelCase from "@/utils/snakeCaseConverter";

type CanonicalResultsShareURLParams = {
  lessonSlug: string;
  attemptId: string;
};
export type CanonicalResultsSharePageProps = {
  browseData: LessonBrowseData;
  content: LessonContent;
  attemptData: LessonAttemptCamelCase;
};

const CanonicalResultsSharePage = (props: CanonicalResultsSharePageProps) => {
  const { browseData, content, attemptData } = props;
  return (
    <MathJaxProvider>
      {" "}
      <PupilViewsResults
        browseData={browseData}
        attemptData={attemptData}
        starterQuizQuestionsArray={content.starterQuiz}
        exitQuizQuestionsArray={content.exitQuiz}
      />
    </MathJaxProvider>
  );
};

export const getServerSideProps: GetServerSideProps<
  CanonicalResultsSharePageProps,
  CanonicalResultsShareURLParams
> = async (context) => {
  return getPageProps({
    page: "pupil-canonical-results-share::getServerSideProps",
    context,
    withIsr: false,
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

      const networkClient = new NetworkClient({
        getLessonAttemptUrl: getBrowserConfig("oakGetLessonAttemptUrl"),
        logLessonAttemptUrl: getBrowserConfig("oakLogLessonAttemptUrl"),
        getTeacherNoteUrl: getBrowserConfig("oakGetTeacherNoteUrl"),
        addTeacherNoteUrl: getBrowserConfig("oakAddTeacherNoteUrl"),
      });
      const attemptData = await networkClient.getAttempt(attemptId);
      const parsedAttemptData = keysToCamelCase(attemptData[attemptId]);

      if (!parsedAttemptData) {
        throw new Error("unexpected attemptData");
      }

      const results: GetServerSidePropsResult<CanonicalResultsSharePageProps> =
        {
          props: {
            browseData,
            content,
            attemptData: parsedAttemptData,
          },
        };
      return results;
    },
  });
};

export default CanonicalResultsSharePage;
