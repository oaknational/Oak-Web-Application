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
  pickAvailableSectionsForLesson,
} from "@/components/PupilViews/PupilExperience";
import { requestLessonResources } from "@/components/PupilComponents/pupilUtils/requestLessonResources";
import {
  PupilAnalyticsProvider,
  getPupilPathwayData,
} from "@/components/PupilComponents/PupilAnalyticsProvider/PupilAnalyticsProvider";
import {
  isLessonReviewSection,
  isLessonSection,
} from "@/components/PupilComponents/LessonEngineProvider";

const PupilsPage: NextPage<PupilExperienceViewProps> = ({
  curriculumData,
  hasWorksheet,
  initialSection,
}) => {
  return (
    <PupilAnalyticsProvider
      pupilPathwayData={getPupilPathwayData(curriculumData)}
    >
      <PupilExperienceView
        curriculumData={curriculumData}
        hasWorksheet={hasWorksheet}
        initialSection={initialSection}
      />
    </PupilAnalyticsProvider>
  );
};

export type PupilPageURLParams = {
  lessonSlug: string;
  unitSlug: string;
  programmeSlug: string;
  section: string;
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
      const { lessonSlug, unitSlug, programmeSlug, section } = context.params;

      // 404 if the section is not valid
      if (!isLessonSection(section)) {
        return {
          notFound: true,
        };
      }

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

      // 404 if the lesson does not contain the given section
      if (
        isLessonReviewSection(section) &&
        !pickAvailableSectionsForLesson(curriculumData).includes(section)
      ) {
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
          initialSection: section,
        },
      };

      return results;
    },
  });
};

export default PupilsPage;
