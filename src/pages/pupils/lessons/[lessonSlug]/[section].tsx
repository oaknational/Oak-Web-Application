import { GetStaticProps } from "next";

import getPageProps from "@/node-lib/getPageProps";
import { PupilExperienceViewProps } from "@/components/PupilViews/PupilExperience";
import { getStaticPaths as getStaticPathsTemplate } from "@/pages-helpers/get-static-paths";
import {
  getProps,
  PupilLessonPageURLParams,
} from "@/pages-helpers/pupil/lessons-pages/getProps";

export { PupilExperienceView as default } from "@/components/PupilViews/PupilExperience";

/**
 * Test URLs:
 *
 * Non-published legacy lesson - should result in 404:
 * http://localhost:3000/pupils/lessons/what-is-video-c4v68d
 *
 * Published legacy lesson:
 * http://localhost:3000/pupils/lessons/myths-and-folktales-6cwk0c
 *
 * Published lesson:
 * http://localhost:3000/pupils/lessons/transverse-waves
 *
 *
 */

export const getStaticPaths = getStaticPathsTemplate<PupilLessonPageURLParams>;

export const getStaticProps: GetStaticProps<
  PupilExperienceViewProps,
  PupilLessonPageURLParams
> = async (context) => {
  return getPageProps({
    page: "pupils-lesson-experience-canonical::getStaticProps",
    context,
    getProps: getProps({ context, page: "canonical" }),
  });
};
