import {
  GetStaticPathsResult,
  GetStaticProps,
  GetStaticPropsResult,
  NextPage,
} from "next";

import getPageProps from "@/node-lib/getPageProps";
import {
  getFallbackBlockingConfig,
  shouldSkipInitialBuild,
} from "@/node-lib/isr";
import curriculumApi2023 from "@/node-lib/curriculum-api-2023";
import {
  PupilExperienceView,
  PupilExperienceViewProps,
} from "@/components/PupilViews/PupilExperience";
import { requestLessonResources } from "@/components/PupilComponents/pupilUtils/requestLessonResources";
import { resolveOakHref } from "@/common-lib/urls";
import {
  PupilAnalyticsProvider,
  getPupilPathwayData,
} from "@/components/PupilComponents/PupilAnalyticsProvider/PupilAnalyticsProvider";

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

const PupilsCanonicalPage: NextPage<PupilExperienceViewProps> = ({
  curriculumData,
  hasWorksheet,
  backUrl,
}) => {
  return (
    <PupilAnalyticsProvider
      pupilPathwayData={getPupilPathwayData(curriculumData)}
    >
      <PupilExperienceView
        curriculumData={curriculumData}
        hasWorksheet={hasWorksheet}
        backUrl={backUrl}
      />
    </PupilAnalyticsProvider>
  );
};

type PupilCanonicalPageURLParams = {
  lessonSlug: string;
};

export const getStaticPaths = async () => {
  if (shouldSkipInitialBuild) {
    return getFallbackBlockingConfig();
  }

  const config: GetStaticPathsResult<PupilCanonicalPageURLParams> = {
    fallback: "blocking",
    paths: [],
  };
  return config;
};

export const getStaticProps: GetStaticProps<
  PupilExperienceViewProps,
  PupilCanonicalPageURLParams
> = async (context) => {
  return getPageProps({
    page: "pupils-lesson-overview-legacy-canonical::getStaticProps",
    context,
    getProps: async () => {
      if (!context.params) {
        throw new Error("No context.params");
      }
      const { lessonSlug } = context.params;

      const curriculumData =
        await curriculumApi2023.pupilLessonOverviewCanonical({
          lessonSlug,
        });

      if (!curriculumData) {
        return {
          notFound: true,
        };
      }

      const backUrl = curriculumData.isLegacy
        ? `${resolveOakHref({
            page: "classroom",
          })}/units/${curriculumData.unitSlug}`
        : null;

      const { transcriptSentences, hasWorksheet } =
        await requestLessonResources({ curriculumData });

      const results: GetStaticPropsResult<PupilExperienceViewProps> = {
        props: {
          curriculumData: {
            ...curriculumData,
            transcriptSentences: transcriptSentences ?? [],
          },
          hasWorksheet,
          backUrl,
        },
      };

      return results;
    },
  });
};

export default PupilsCanonicalPage;
