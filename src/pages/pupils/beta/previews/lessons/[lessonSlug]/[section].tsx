import { GetStaticProps, GetStaticPropsResult } from "next";

import getPageProps from "@/node-lib/getPageProps";
import curriculumApi2023 from "@/node-lib/curriculum-api-2023";
import {
  PupilExperienceViewProps,
  pickAvailableSectionsForLesson,
} from "@/components/PupilViews/PupilExperience";
import { requestLessonResources } from "@/components/PupilComponents/pupilUtils/requestLessonResources";
import { resolveOakHref } from "@/common-lib/urls";
import {
  isLessonReviewSection,
  isLessonSection,
} from "@/components/PupilComponents/LessonEngineProvider";
import { getStaticPaths as getStaticPathsTemplate } from "@/pages-helpers/get-static-paths";

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
type PupilCanonicalPageURLParams = {
  lessonSlug: string;
  section: string;
};

export const getStaticPaths =
  getStaticPathsTemplate<PupilCanonicalPageURLParams>;

export const getStaticProps: GetStaticProps<
  PupilExperienceViewProps,
  PupilCanonicalPageURLParams
> = async (context) => {
  return getPageProps({
    page: "pupils-preview-lesson::getStaticProps",
    context,
    getProps: async () => {
      if (!context.params) {
        throw new Error("No context.params");
      }
      const { lessonSlug, section } = context.params;

      // 404 if the section is not valid
      if (!isLessonSection(section)) {
        return {
          notFound: true,
        };
      }

      const res = await curriculumApi2023.pupilPreviewLessonQuery({
        lessonSlug,
      });

      if (!res) {
        return {
          notFound: true,
        };
      }

      const { browseData, content } = res;

      // 404 if the lesson does not contain the given section
      if (
        isLessonReviewSection(section) &&
        !pickAvailableSectionsForLesson(content).includes(section)
      ) {
        return {
          notFound: true,
        };
      }

      const backUrl = resolveOakHref({
        page: "pupil-year-index",
      });

      const { transcriptSentences, hasWorksheet } =
        await requestLessonResources({ lessonContent: content });

      const results: GetStaticPropsResult<PupilExperienceViewProps> = {
        props: {
          lessonContent: {
            ...content,
            transcriptSentences: transcriptSentences ?? [],
          },
          browseData,
          hasWorksheet,
          backUrl,
          initialSection: section,
        },
      };

      return results;
    },
  });
};
