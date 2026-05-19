import { GetStaticProps, GetStaticPropsResult } from "next";

import { resolveOakHref } from "@/common-lib/urls";
import { isLessonSection } from "@/components/PupilComponents/lessonSections";
import getPageProps from "@/node-lib/getPageProps";
import curriculumApi2023 from "@/node-lib/curriculum-api-2023";
import errorReporter from "@/common-lib/error-reporter";
import OakError from "@/errors/OakError";
import { getStaticPaths as getStaticPathsTemplate } from "@/pages-helpers/get-static-paths";
import {
  buildPupilLessonPageProps,
  isAvailablePupilLessonSection,
} from "@/pages-helpers/pupil/lessons-pages/pupilLessonPage.helpers";
import { PupilLessonPageProps } from "@/pages-helpers/pupil/lessons-pages/pupilLessonPage.types";

export { PupilExperienceView as default } from "@/components/PupilViews/PupilExperience";

/**
 * Test URLs:
 *
 * Non-published lesson:
 * http://localhost:3000/pupils/l/video-editing-7a9a/lessons/what-is-video-c4v68d
 *
 * Published lesson:
 * http://localhost:3000/pupils/l/the-oral-tradition-7424/lessons/myths-and-folktales-6cwk0c
 *
 *
 */

type PupilLegacyCanonicalPageURLParams = {
  lessonSlug: string;
  redirectFrom: string;
  section: string;
};

export const getStaticPaths =
  getStaticPathsTemplate<PupilLegacyCanonicalPageURLParams>;

export const getStaticProps: GetStaticProps<
  PupilLessonPageProps,
  PupilLegacyCanonicalPageURLParams
> = async (context) => {
  return getPageProps({
    page: "pupils-lesson-overview-legacy-canonical::getStaticProps",
    context,
    getProps: async () => {
      if (!context.params) {
        throw new OakError({ code: "urls/failed-to-resolve" });
      }
      const { lessonSlug, redirectFrom, section } = context.params;

      // 404 if the section is not valid
      if (!isLessonSection(section)) {
        return {
          notFound: true,
        };
      }

      const redirectUrl = `${resolveOakHref({
        page: "classroom",
      })}/lessons/${lessonSlug}`;

      const res = await curriculumApi2023
        .pupilLessonQuery({
          lessonSlug,
        })
        .catch((error) => {
          const forwardError: OakError = { ...error };
          if (forwardError.code === "curriculum-api/not-found") {
            forwardError.config.shouldNotify = true;
          }

          errorReporter(
            "pupils::lesson-overview-legacy-canonical::getStaticProps::pupilLessonQuery",
          )(forwardError, {
            severity: "warning",
            lessonSlug,
            redirectFrom,
          });

          console.error("Error in getStaticProps", error);

          return null;
        });

      if (!res) {
        return {
          redirect: {
            destination: redirectUrl,
            permanent: false,
          },
        };
      }

      const { browseData, content } = res;
      // 404 if the lesson does not contain the given section
      if (!isAvailablePupilLessonSection(section, content, null)) {
        return {
          notFound: true,
        };
      }

      const backUrl = `${resolveOakHref({
        page: "classroom",
      })}/units/${redirectFrom}`;

      const props = await buildPupilLessonPageProps({
        browseData,
        lessonContent: content,
        backUrl,
        initialSection: section,
        pageType: "canonical",
        variant: null,
      });

      const results: GetStaticPropsResult<PupilLessonPageProps> = { props };

      return results;
    },
  });
};
