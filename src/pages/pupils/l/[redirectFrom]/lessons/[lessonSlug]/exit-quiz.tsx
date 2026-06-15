import { GetStaticProps, GetStaticPropsContext, PreviewData } from "next";

import getPageProps from "@/node-lib/getPageProps";
import { getStaticPaths as getStaticPathsTemplate } from "@/pages-helpers/get-static-paths";
import {
  getProps,
  PupilLessonPageURLParams,
} from "@/pages-helpers/pupil/lessons-pages/getProps";
import { QuizPageContent } from "@/pages-helpers/pupil/lessons-pages/new/QuizPageContent";
import { PupilLayout } from "@/components/PupilComponents/PupilLayout/PupilLayout";
import { getSeoProps } from "@/browser-lib/seo/getSeoProps";
import { PupilLessonPageProps } from "@/pages-helpers/pupil/lessons-pages/pupilLessonPage.types";

type ExitQuizPageURLParams = {
  redirectFrom: string;
  lessonSlug: string;
};

const PupilLessonExitQuizPage = (props: PupilLessonPageProps) => {
  const { browseData, lessonContent, variant } = props;

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
      <QuizPageContent
        section="exit-quiz"
        questionsArray={lessonContent.exitQuiz}
        lessonSlug={browseData.lessonSlug}
        phase={browseData.programmeFields.phase as "primary" | "secondary"}
      />
    </PupilLayout>
  );
};

export default PupilLessonExitQuizPage;

export const getStaticPaths = getStaticPathsTemplate<ExitQuizPageURLParams>;

export const getStaticProps: GetStaticProps<
  PupilLessonPageProps,
  ExitQuizPageURLParams
> = async (context) => {
  const contextWithSection = {
    ...context,
    params: context.params
      ? {
          ...context.params,
          section: "exit-quiz",
        }
      : undefined,
  } as GetStaticPropsContext<PupilLessonPageURLParams, PreviewData>;

  return getPageProps({
    page: "pupils-lesson-legacy-exit-quiz::getStaticProps",
    context,
    getProps: getProps({
      context: contextWithSection,
      page: "legacy-canonical",
    }),
  });
};
