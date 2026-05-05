import { ParsedUrlQuery } from "querystring";

import { GetStaticProps, GetStaticPropsContext, PreviewData } from "next";

import getPageProps from "@/node-lib/getPageProps";
import { getStaticPaths as getStaticPathsTemplate } from "@/pages-helpers/get-static-paths";
import {
  getProps,
  PupilLessonPageURLParams,
} from "@/pages-helpers/pupil/lessons-pages/getProps";
import { QuizPageContent } from "@/pages-helpers/pupil/lessons-pages/new/QuizPageContent";
import { PupilExperienceViewProps } from "@/components/PupilViews/PupilExperience";
import { PupilLayout } from "@/components/PupilComponents/PupilLayout/PupilLayout";
import { getSeoProps } from "@/browser-lib/seo/getSeoProps";

type ExitQuizPageURLParams = {
  lessonSlug: string;
};

const PupilLessonExitQuizNewPage = (props: PupilExperienceViewProps) => {
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

export default PupilLessonExitQuizNewPage;

export const getStaticPaths = getStaticPathsTemplate<ExitQuizPageURLParams>;

export const getStaticProps: GetStaticProps<
  PupilExperienceViewProps,
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
    page: "pupils-lesson-new-exit-quiz::getStaticProps",
    context: context as GetStaticPropsContext<ParsedUrlQuery, PreviewData>,
    getProps: getProps({ context: contextWithSection, page: "canonical" }),
  });
};
