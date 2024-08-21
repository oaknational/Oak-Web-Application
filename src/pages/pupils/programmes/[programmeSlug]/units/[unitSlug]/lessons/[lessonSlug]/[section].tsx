import { GetStaticProps } from "next";

import getPageProps from "@/node-lib/getPageProps";
import { PupilExperienceViewProps } from "@/components/PupilViews/PupilExperience";
import { getStaticPaths as getStaticPathsTemplate } from "@/pages-helpers/get-static-paths";
import {
  getProps,
  PupilLessonPageURLParams,
} from "@/pages-helpers/pupil/lessons-pages/getProps";

export { PupilExperienceView as default } from "@/components/PupilViews/PupilExperience";

export const getStaticPaths = getStaticPathsTemplate<PupilLessonPageURLParams>;

export const getStaticProps: GetStaticProps<
  PupilExperienceViewProps,
  PupilLessonPageURLParams
> = async (context) => {
  return getPageProps({
    page: "pupils-lesson-overview::getStaticProps",
    context,
    getProps: getProps({ context, page: "browse" }),
  });
};
