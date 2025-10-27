import { hubspotSubmitForm } from "../../../browser-lib/hubspot/forms";
import {
  CampaignNewsletterHubspotFormData,
  getHubspotNewsletterPayload,
  NewsletterHubspotFormData,
} from "../../../browser-lib/hubspot/forms/getHubspotFormPayloads";
import getHubspotUserToken from "../../../browser-lib/hubspot/forms/getHubspotUserToken";
import useAnalytics from "../../../context/Analytics/useAnalytics";
import useUtmParams from "../../../hooks/useUtmParams";
import getBrowserConfig from "../../../browser-lib/getBrowserConfig";

type UseNewsletterFormProps = {
  onSubmit?: () => void;
  hubspotNewsletterFormId?: string;
};
const useNewsletterForm = (props: UseNewsletterFormProps = {}) => {
  const hubspotNewsletterFormId =
    props.hubspotNewsletterFormId ??
    getBrowserConfig("hubspotNewsletterFormId");
  const { identify, posthogDistinctId } = useAnalytics();
  const utmParams = useUtmParams();

  const onSubmit = (
    data: NewsletterHubspotFormData | CampaignNewsletterHubspotFormData,
  ) => {
    if (props.onSubmit) {
      props.onSubmit();
    }

    const hutk = getHubspotUserToken();
    const newsletterPayload = getHubspotNewsletterPayload({
      hutk,
      data: { ...data, ...utmParams },
    });

    const hubspotFormResponse = hubspotSubmitForm({
      hubspotFormId: hubspotNewsletterFormId,
      payload: newsletterPayload,
    });

    if (posthogDistinctId) {
      identify(posthogDistinctId, { email: data.email || data.emailTextOnly }, [
        "hubspot",
      ]);
    }
    return hubspotFormResponse;
  };

  return { onSubmit };
};

export default useNewsletterForm;
