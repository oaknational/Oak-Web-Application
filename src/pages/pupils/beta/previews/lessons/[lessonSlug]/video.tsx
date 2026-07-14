import { GetStaticProps, GetStaticPropsContext, PreviewData } from "next";

import getPageProps from "@/node-lib/getPageProps";
import { getStaticPaths as getStaticPathsTemplate } from "@/pages-helpers/get-static-paths";
import {
  getProps,
  PupilLessonPageURLParams,
} from "@/pages-helpers/pupil/lessons-pages/getProps";
import { PupilLessonPageProps } from "@/pages-helpers/pupil/lessons-pages/pupilLessonPage.types";

export { default } from "@/components/PupilComponents/Views/PageContent/VideoPageContent";

type VideoPageURLParams = {
  lessonSlug: string;
};

export const getStaticPaths = getStaticPathsTemplate<VideoPageURLParams>;

export const getStaticProps: GetStaticProps<
  PupilLessonPageProps,
  VideoPageURLParams
> = async (context) => {
  const contextWithSection = {
    ...context,
    params: context.params
      ? {
          ...context.params,
          section: "video",
        }
      : undefined,
  } as GetStaticPropsContext<PupilLessonPageURLParams, PreviewData>;

  return getPageProps({
    page: "pupils-lesson-preview-video::getStaticProps",
    context,
    getProps: getProps({ context: contextWithSection, page: "preview" }),
  });
};
