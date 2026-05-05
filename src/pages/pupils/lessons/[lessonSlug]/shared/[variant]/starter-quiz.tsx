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

type StarterQuizPageURLParams = {
  lessonSlug: string;
};

const PupilLessonStarterQuizNewPage = (props: PupilExperienceViewProps) => {
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
        section="starter-quiz"
        questionsArray={lessonContent.starterQuiz}
        lessonSlug={browseData.lessonSlug}
        phase={browseData.programmeFields.phase as "primary" | "secondary"}
      />
    </PupilLayout>
  );
};

export default PupilLessonStarterQuizNewPage;

export const getStaticPaths = getStaticPathsTemplate<StarterQuizPageURLParams>;

export const getStaticProps: GetStaticProps<
  PupilExperienceViewProps,
  StarterQuizPageURLParams
> = async (context) => {
  const contextWithSection = {
    ...context,
    params: context.params
      ? {
          ...context.params,
          section: "starter-quiz",
        }
      : undefined,
  } as GetStaticPropsContext<PupilLessonPageURLParams, PreviewData>;

  return getPageProps({
    page: "pupils-lesson-new-starter-quiz::getStaticProps",
    context: context as GetStaticPropsContext<ParsedUrlQuery, PreviewData>,
    getProps: getProps({ context: contextWithSection, page: "canonical" }),
  });
};
