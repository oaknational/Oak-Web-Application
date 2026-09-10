import { GetStaticProps, GetStaticPropsContext, PreviewData } from "next";

import getPageProps from "@/node-lib/getPageProps";
import { getStaticPaths as getStaticPathsTemplate } from "@/pages-helpers/get-static-paths";
import {
  getProps,
  PupilLessonPageURLParams,
} from "@/pages-helpers/pupil/lessons-pages/getProps";
import { PupilLessonPageProps } from "@/pages-helpers/pupil/lessons-pages/pupilLessonPage.types";

export { default } from "@/components/PupilComponents/Views/PageContent/StarterQuizPageContent";

export const getStaticPaths = getStaticPathsTemplate<PupilLessonPageURLParams>;

export const getStaticProps: GetStaticProps<
  PupilLessonPageProps,
  PupilLessonPageURLParams
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
    page: "pupils-lesson-browse-starter-quiz::getStaticProps",
    context,
    getProps: getProps({ context: contextWithSection, page: "browse" }),
  });
};
