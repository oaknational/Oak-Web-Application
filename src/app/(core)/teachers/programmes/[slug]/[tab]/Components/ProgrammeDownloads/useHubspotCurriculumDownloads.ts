import { ResourceFormValues } from "@/components/TeacherComponents/types/downloadAndShare.types";
import { getHubspotCurriculumDownloadsFormPayload } from "@/browser-lib/hubspot/forms/getHubspotFormPayloads";
import getHubspotUserToken from "@/browser-lib/hubspot/forms/getHubspotUserToken";
import useUtmParams from "@/hooks/useUtmParams";
import useAnalytics from "@/context/Analytics/useAnalytics";
import { hubspotSubmitForm } from "@/browser-lib/hubspot/forms";
import getBrowserConfig from "@/browser-lib/getBrowserConfig";
import errorReporter from "@/common-lib/error-reporter";
import OakError from "@/errors/OakError";

export const useHubspotCurriculumDownloads = () => {
  const hutk = getHubspotUserToken();
  const utmParams = useUtmParams();
  const { posthogDistinctId } = useAnalytics();
  const hubspotCurriculumDownloadsFormId = getBrowserConfig(
    "hubspotCurriculumDownloadsFormId",
  );
  const reportError = errorReporter("hubspotCurriculumDownloadsForm");

  const onHubspotSubmit = async (
    data: ResourceFormValues & {
      phaseSlug: string;
      subjectSlug: string;
    },
  ) => {
    const school =
      data.school === "homeschool" || data.school === "notListed"
        ? data.school
        : data.schoolName;

    const curriculumDownloadsPayload = getHubspotCurriculumDownloadsFormPayload(
      {
        hutk,
        data: {
          ...data,
          ...utmParams,
          oakUserId: posthogDistinctId ?? undefined,
          schoolName: school,
          phaseSlug: data.phaseSlug,
          subjectSlug: data.subjectSlug,
        },
      },
    );
    try {
      const hubspotFormResponse = await hubspotSubmitForm({
        hubspotFormId: hubspotCurriculumDownloadsFormId,
        payload: curriculumDownloadsPayload,
      });

      return hubspotFormResponse;
    } catch (error) {
      if (error instanceof OakError) {
        reportError(error);
      } else {
        reportError(
          new OakError({
            code: "hubspot/unknown",
            originalError: error,
          }),
        );
      }
    }
  };

  return { onHubspotSubmit };
};
