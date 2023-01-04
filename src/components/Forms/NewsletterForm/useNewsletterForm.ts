import { hubspotSubmitForm } from "../../../browser-lib/hubspot/forms";
import { HubspotFormData } from "../../../browser-lib/hubspot/forms/hubspotSubmitForm";
import config from "../../../config/browser";
import useAnalytics from "../../../context/Analytics/useAnalytics";
import useAnonymousId from "../../../browser-lib/analytics/useAnonymousId";
import useUtmParams from "../../../hooks/useUtmParams";

const hubspotNewsletterFormId = config.get("hubspotNewsletterFormId");

type UseNewsletterFormProps = {
  onSubmit?: () => void;
};
const useNewsletterForm = (props: UseNewsletterFormProps = {}) => {
  const anonymousId = useAnonymousId();
  const { identify } = useAnalytics();
  const utmParams = useUtmParams();

  const onSubmit = (data: HubspotFormData) => {
    if (props.onSubmit) {
      props.onSubmit();
    }

    const hubspotFormResponse = hubspotSubmitForm({
      hubspotFormId: hubspotNewsletterFormId,
      data: { ...data, ...utmParams },
    });

    identify(anonymousId, { email: data.email || data.emailTextOnly });

    return hubspotFormResponse;
  };

  return { onSubmit };
};

export default useNewsletterForm;
