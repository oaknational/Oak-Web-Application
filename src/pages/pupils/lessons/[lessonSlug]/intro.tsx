import { GetStaticProps, GetStaticPropsContext, PreviewData } from "next";

import getPageProps from "@/node-lib/getPageProps";
import { getStaticPaths as getStaticPathsTemplate } from "@/pages-helpers/get-static-paths";
import {
  getProps,
  PupilLessonPageURLParams,
} from "@/pages-helpers/pupil/lessons-pages/getProps";
import { PupilLessonPageProps } from "@/pages-helpers/pupil/lessons-pages/pupilLessonPage.types";

export { default } from "@/components/PupilComponents/Views/PageContent/IntroPageContent";

type IntroPageURLParams = {
  lessonSlug: string;
};

export const getStaticPaths = getStaticPathsTemplate<IntroPageURLParams>;

export const getStaticProps: GetStaticProps<
  PupilLessonPageProps,
  IntroPageURLParams
> = async (context) => {
  const contextWithSection = {
    ...context,
    params: context.params
      ? {
          ...context.params,
          section: "intro",
        }
      : undefined,
  } as GetStaticPropsContext<PupilLessonPageURLParams, PreviewData>;

  return getPageProps({
    page: "pupils-lesson-canonical-intro::getStaticProps",
    context,
    getProps: getProps({ context: contextWithSection, page: "canonical" }),
  });
};
