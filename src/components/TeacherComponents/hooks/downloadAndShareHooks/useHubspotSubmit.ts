import {
  ResourceFormProps,
  ResourceFormWithRiskAssessmentProps,
} from "@/components/TeacherComponents/types/downloadAndShare.types";
import { getHubspotDownloadsFormPayload } from "@/browser-lib/hubspot/forms/getHubspotFormPayloads";
import getHubspotUserToken from "@/browser-lib/hubspot/forms/getHubspotUserToken";
import useUtmParams from "@/hooks/useUtmParams";
import useAnalytics from "@/context/Analytics/useAnalytics";
import { hubspotSubmitForm } from "@/browser-lib/hubspot/forms";
import getBrowserConfig from "@/browser-lib/getBrowserConfig";
import errorReporter from "@/common-lib/error-reporter";
import OakError from "@/errors/OakError";

export const useHubspotSubmit = () => {
  const hutk = getHubspotUserToken();
  const utmParams = useUtmParams();
  const { posthogDistinctId } = useAnalytics();
  const hubspotDownloadsFormId = getBrowserConfig("hubspotDownloadsFormId");
  const reportError = errorReporter("hubsportSubmitForm");

  const onHubspotSubmit = async (
    data: ResourceFormProps | ResourceFormWithRiskAssessmentProps,
  ) => {
    const school =
      data.school === "homeschool" || data.school === "notListed"
        ? data.school
        : data.schoolName;
    const downloadsPayload = getHubspotDownloadsFormPayload({
      hutk,
      data: {
        ...data,
        ...utmParams,
        oakUserId: posthogDistinctId ? posthogDistinctId : undefined,
        schoolName: school,
      },
    });
    try {
      const hubspotFormResponse = await hubspotSubmitForm({
        hubspotFormId: hubspotDownloadsFormId,
        payload: downloadsPayload,
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
