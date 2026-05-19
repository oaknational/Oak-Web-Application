import { GetStaticProps, GetStaticPropsContext, PreviewData } from "next";

import getPageProps from "@/node-lib/getPageProps";
import { getStaticPaths as getStaticPathsTemplate } from "@/pages-helpers/get-static-paths";
import {
  getProps,
  PupilLessonPageURLParams,
} from "@/pages-helpers/pupil/lessons-pages/getProps";
import { hasValidSharedVariant } from "@/pages-helpers/pupil/lessons-pages/validateSharedVariant";
import { QuizPageContent } from "@/pages-helpers/pupil/lessons-pages/new/QuizPageContent";
import { PupilLayout } from "@/components/PupilComponents/PupilLayout/PupilLayout";
import { getSeoProps } from "@/browser-lib/seo/getSeoProps";
import { PupilLessonPageProps } from "@/pages-helpers/pupil/lessons-pages/pupilLessonPage.types";

type StarterQuizPageURLParams = {
  lessonSlug: string;
};

const PupilLessonStarterQuizNewPage = (props: PupilLessonPageProps) => {
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
  PupilLessonPageProps,
  StarterQuizPageURLParams
> = async (context) => {
  if (!hasValidSharedVariant(context)) {
    return { notFound: true };
  }

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
    context,
    getProps: getProps({ context: contextWithSection, page: "canonical" }),
  });
};
