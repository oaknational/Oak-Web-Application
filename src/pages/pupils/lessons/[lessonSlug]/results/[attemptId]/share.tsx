import { GetServerSideProps, GetServerSidePropsResult } from "next";
import { oakDefaultTheme, OakThemeProvider } from "@oaknational/oak-components";

import { MathJaxProvider } from "@/browser-lib/mathjax/MathJaxProvider";
import { PupilViewsResults } from "@/components/PupilViews/PupilResults";
import curriculumApi2023 from "@/node-lib/curriculum-api-2023";
import {
  LessonBrowseData,
  LessonContent,
} from "@/node-lib/curriculum-api-2023/queries/pupilLesson/pupilLesson.schema";
import getPageProps from "@/node-lib/getPageProps";
import keysToCamelCase from "@/utils/snakeCaseConverter";
import { LessonAttemptCamelCase } from "@/node-lib/pupil-api/types";
import { pupilDatastore } from "@/node-lib/pupil-api/pupilDataStore";

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
    <OakThemeProvider theme={oakDefaultTheme}>
      <MathJaxProvider>
        {" "}
        <PupilViewsResults
          browseData={browseData}
          attemptData={attemptData}
          starterQuizQuestionsArray={content.starterQuiz}
          exitQuizQuestionsArray={content.exitQuiz}
        />
      </MathJaxProvider>
    </OakThemeProvider>
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

      const { attempts } = await pupilDatastore.getLessonAttempt({
        attemptId,
      });

      const parsedAttemptData = keysToCamelCase(attempts[attemptId]);

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
