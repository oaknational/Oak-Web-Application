import { hubspotSubmitForm } from "../../../browser-lib/hubspot/forms";
import { HubspotFormData } from "../../../browser-lib/hubspot/forms/hubspotSubmitForm";
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

  const onSubmit = (data: HubspotFormData) => {
    if (props.onSubmit) {
      props.onSubmit();
    }

    const hubspotFormResponse = hubspotSubmitForm({
      hubspotFormId: hubspotNewsletterFormId,
      data: { ...data, ...utmParams },
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
