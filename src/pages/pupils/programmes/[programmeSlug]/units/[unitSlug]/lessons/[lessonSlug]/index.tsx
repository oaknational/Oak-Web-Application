import {
  GetStaticPathsResult,
  GetStaticProps,
  GetStaticPropsResult,
  NextPage,
} from "next";

import getPageProps from "@/node-lib/getPageProps";
import curriculumApi2023 from "@/node-lib/curriculum-api-2023";
import {
  getFallbackBlockingConfig,
  shouldSkipInitialBuild,
} from "@/node-lib/isr";
import {
  PupilExperienceView,
  PupilExperienceViewProps,
} from "@/components/PupilViews/PupilExperience";
import { requestLessonResources } from "@/components/PupilComponents/pupilUtils/requestLessonResources";

const PupilsPage: NextPage<PupilExperienceViewProps> = ({
  curriculumData,
  hasWorksheet,
}) => (
  <PupilExperienceView
    curriculumData={curriculumData}
    hasWorksheet={hasWorksheet}
  />
);

export type PupilPageURLParams = {
  lessonSlug: string;
  unitSlug: string;
  programmeSlug: string;
};

export const getStaticPaths = async () => {
  if (shouldSkipInitialBuild) {
    return getFallbackBlockingConfig();
  }

  const config: GetStaticPathsResult<PupilPageURLParams> = {
    fallback: "blocking",
    paths: [],
  };
  return config;
};

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
      const { lessonSlug, unitSlug, programmeSlug } = context.params;

      const curriculumData = await curriculumApi2023.pupilLessonOverview({
        programmeSlug,
        lessonSlug,
        unitSlug,
      });

      if (!curriculumData) {
        return {
          notFound: true,
        };
      }

      const { transcriptSentences, hasWorksheet } =
        await requestLessonResources({ curriculumData });

      const results: GetStaticPropsResult<PupilExperienceViewProps> = {
        props: {
          curriculumData: {
            ...curriculumData,
            transcriptSentences: transcriptSentences ?? [],
          },
          hasWorksheet,
        },
      };

      return results;
    },
  });
};

export default PupilsPage;
