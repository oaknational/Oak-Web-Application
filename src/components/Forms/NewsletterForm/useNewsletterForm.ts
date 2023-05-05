import { hubspotSubmitForm } from "../../../browser-lib/hubspot/forms";
import getHubspotNewsletterPayload, { NewsletterHubspotFormData } from "../../../browser-lib/hubspot/forms/getHubspotNewsletterFormPayload";
import getHubspotUserToken from "../../../browser-lib/hubspot/forms/getHubspotUserToken";
import config from "../../../config/browser";
import useAnalytics from "../../../context/Analytics/useAnalytics";
import useUtmParams from "../../../hooks/useUtmParams";

const hubspotNewsletterFormId = config.get("hubspotNewsletterFormId");

type UseNewsletterFormProps = {
  onSubmit?: () => void;
};
const useNewsletterForm = (props: UseNewsletterFormProps = {}) => {
  const { identify, posthogDistinctId } = useAnalytics();
  const utmParams = useUtmParams();

  const onSubmit = (data: NewsletterHubspotFormData) => {
    if (props.onSubmit) {
      props.onSubmit();
    }

    const hutk = getHubspotUserToken();
    const newsletterPayload = getHubspotNewsletterPayload({ hutk, data:{ ...data, ...utmParams } });

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
