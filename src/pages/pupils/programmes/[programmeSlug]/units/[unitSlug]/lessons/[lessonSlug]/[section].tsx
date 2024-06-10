import { GetStaticProps, GetStaticPropsResult } from "next";

import getPageProps from "@/node-lib/getPageProps";
import curriculumApi2023 from "@/node-lib/curriculum-api-2023";
import {
  PupilExperienceViewProps,
  pickAvailableSectionsForLesson,
} from "@/components/PupilViews/PupilExperience";
import { requestLessonResources } from "@/components/PupilComponents/pupilUtils/requestLessonResources";
import {
  isLessonReviewSection,
  isLessonSection,
} from "@/components/PupilComponents/LessonEngineProvider";
import { getStaticPaths as getStaticPathsTemplate } from "@/pages-helpers/get-static-paths";
import { resolveOakHref } from "@/common-lib/urls";

export { PupilExperienceView as default } from "@/components/PupilViews/PupilExperience";

export type PupilPageURLParams = {
  lessonSlug: string;
  unitSlug: string;
  programmeSlug: string;
  section: string;
};

export const getStaticPaths = getStaticPathsTemplate<PupilPageURLParams>;

export const getStaticProps: GetStaticProps<
  PupilExperienceViewProps,
  PupilPageURLParams
> = async (context) => {
  return getPageProps({
    page: "pupils-lesson-overview::getStaticProps",
    context,
    getProps: async () => {
      if (!context.params) {
        throw new Error("context.params is undefined");
      }
      const { lessonSlug, unitSlug, programmeSlug, section } = context.params;

      // 404 if the section is not valid
      if (!isLessonSection(section)) {
        return {
          notFound: true,
        };
      }

      const res = await curriculumApi2023.pupilLessonQuery({
        programmeSlug,
        lessonSlug,
        unitSlug,
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
        page: "pupil-lesson-index",
        programmeSlug,
        unitSlug,
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
          initialSection: section,
          backUrl,
        },
      };

      return results;
    },
  });
};
