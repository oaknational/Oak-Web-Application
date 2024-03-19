import {
  GetStaticPathsResult,
  GetStaticProps,
  GetStaticPropsResult,
  NextPage,
} from "next";

import { resolveOakHref } from "@/common-lib/urls";
import getPageProps from "@/node-lib/getPageProps";
import {
  getFallbackBlockingConfig,
  shouldSkipInitialBuild,
} from "@/node-lib/isr";
import curriculumApi2023 from "@/node-lib/curriculum-api-2023";
import { requestLessonResources } from "@/components/PupilComponents/pupilUtils/requestLessonResources";
import {
  PupilExperienceView,
  PupilExperienceViewProps,
} from "@/components/PupilViews/PupilExperience";
import errorReporter from "@/common-lib/error-reporter";
import OakError from "@/errors/OakError";
import {
  PupilAnalyticsProvider,
  getPupilPathwayData,
} from "@/components/PupilComponents/PupilAnalyticsProvider/PupilAnalyticsProvider";

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

const PupilsLegacyCanonicalPage: NextPage<PupilExperienceViewProps> = ({
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

type PupilLegacyCanonicalPageURLParams = {
  lessonSlug: string;
  redirectFrom: string;
};

export const getStaticPaths = async () => {
  if (shouldSkipInitialBuild) {
    return getFallbackBlockingConfig();
  }

  const config: GetStaticPathsResult<PupilLegacyCanonicalPageURLParams> = {
    fallback: "blocking",
    paths: [],
  };
  return config;
};

export const getStaticProps: GetStaticProps<
  PupilExperienceViewProps,
  PupilLegacyCanonicalPageURLParams
> = async (context) => {
  return getPageProps({
    page: "pupils-lesson-overview-legacy-canonical::getStaticProps",
    context,
    getProps: async () => {
      if (!context.params) {
        throw new OakError({ code: "urls/failed-to-resolve" });
      }
      const { lessonSlug, redirectFrom } = context.params;

      const redirectUrl = `${resolveOakHref({
        page: "classroom",
      })}/lessons/${lessonSlug}`;

      const curriculumData = await curriculumApi2023
        .pupilLessonOverviewCanonical({
          lessonSlug,
        })
        .catch((error) => {
          const forwardError: OakError = { ...error };
          if (forwardError.code === "curriculum-api/not-found") {
            forwardError.config.shouldNotify = true;
          }

          errorReporter(
            "pupils::lesson-overview-legacy-canonical::getStaticProps::pupilLessonOverviewCanonical",
          )(forwardError, {
            severity: "warning",
            lessonSlug,
            redirectFrom,
          });

          console.error("Error in getStaticProps", error);

          return null;
        });

      if (!curriculumData) {
        return {
          redirect: {
            destination: redirectUrl,
            permanent: false,
          },
        };
      }

      const backUrl = `${resolveOakHref({
        page: "classroom",
      })}/units/${redirectFrom}`;

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

export default PupilsLegacyCanonicalPage;
