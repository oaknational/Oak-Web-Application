import { ResourceFormProps } from "../downloadAndShare.types";

import { getHubspotDownloadsFormPayload } from "@/browser-lib/hubspot/forms/getHubspotFormPayloads";
import getHubspotUserToken from "@/browser-lib/hubspot/forms/getHubspotUserToken";
import useUtmParams from "@/hooks/useUtmParams";
import useAnalytics from "@/context/Analytics/useAnalytics";
import { hubspotSubmitForm } from "@/browser-lib/hubspot/forms";
import getBrowserConfig from "@/browser-lib/getBrowserConfig";

export const useHubspotSubmit = () => {
  const hutk = getHubspotUserToken();
  const utmParams = useUtmParams();
  const { posthogDistinctId } = useAnalytics();
  const hubspotDownloadsFormId = getBrowserConfig("hubspotDownloadsFormId");

  const onHubspotSubmit = async (data: ResourceFormProps) => {
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

    const hubspotFormResponse = await hubspotSubmitForm({
      hubspotFormId: hubspotDownloadsFormId,
      payload: downloadsPayload,
    });

    return hubspotFormResponse;
  };

  return { onHubspotSubmit };
};
