import { hubspotSubmitForm } from "../../../browser-lib/hubspot/forms";
import { HubspotFormData } from "../../../browser-lib/hubspot/forms/hubspotSubmitForm";
import config from "../../../config";
import useAnalytics from "../../../context/Analytics/useAnalytics";
import useAnonymousId from "../../../browser-lib/analytics/useAnonymousId";

const hubspotNewsletterFormId = config.get("hubspotNewsletterFormId");

type UseNewsletterFormProps = {
  onSubmit?: () => void;
};
const useNewsletterForm = (props: UseNewsletterFormProps = {}) => {
  const anonymousId = useAnonymousId();
  const { identify } = useAnalytics();

  const onSubmit = (data: HubspotFormData) => {
    if (props.onSubmit) {
      props.onSubmit();
    }

    const hubspotFormResponse = hubspotSubmitForm({
      hubspotFormId: hubspotNewsletterFormId,
      data,
    });

    identify(anonymousId, { email: data.email || data.emailTextOnly });

    return hubspotFormResponse;
  };

  return { onSubmit };
};

export default useNewsletterForm;
