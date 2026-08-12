import { GetStaticProps, GetStaticPropsContext, PreviewData } from "next";

import getPageProps from "@/node-lib/getPageProps";
import { getStaticPaths as getStaticPathsTemplate } from "@/pages-helpers/get-static-paths";
import {
  getProps,
  PupilLessonPageURLParams,
} from "@/pages-helpers/pupil/lessons-pages/getProps";
import { PupilLessonPageProps } from "@/pages-helpers/pupil/lessons-pages/pupilLessonPage.types";

export { default } from "@/components/PupilComponents/Views/PageContent/OverviewPageContent";

type OverviewPageURLParams = {
  lessonSlug: string;
};

export const getStaticPaths = getStaticPathsTemplate<OverviewPageURLParams>;

export const getStaticProps: GetStaticProps<
  PupilLessonPageProps,
  OverviewPageURLParams
> = async (context) => {
  const contextWithSection = {
    ...context,
    params: context.params
      ? {
          ...context.params,
          section: "overview",
        }
      : undefined,
  } as GetStaticPropsContext<PupilLessonPageURLParams, PreviewData>;

  return getPageProps({
    page: "pupils-lesson-preview-overview::getStaticProps",
    context,
    getProps: getProps({ context: contextWithSection, page: "preview" }),
  });
};
