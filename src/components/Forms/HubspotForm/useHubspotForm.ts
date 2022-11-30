import { hubspotSubmitForm } from "../../../browser-lib/hubspot/forms";
import { HubspotFormData } from "../../../browser-lib/hubspot/forms/hubspotSubmitForm";
import useAnalytics from "../../../context/Analytics/useAnalytics";
import useAnonymousId from "../../../browser-lib/analytics/useAnonymousId";
import useUtmParams from "../../../hooks/useUtmParams";

type UseHubspotFormProps = {
  formId: string;
  onSubmit?: () => void;
};

const useHubspotForm = (props: UseHubspotFormProps) => {
  const anonymousId = useAnonymousId();
  const { identify } = useAnalytics();
  const utmParams = useUtmParams();

  const onSubmit = (data: HubspotFormData) => {
    if (props.onSubmit) {
      props.onSubmit();
    }

    const hubspotFormResponse = hubspotSubmitForm({
      hubspotFormId: props.formId,
      data: { ...data, ...utmParams },
    });

    identify(anonymousId, { email: data.email || data.emailTextOnly });

    return hubspotFormResponse;
  };

  return { onSubmit };
};

export default useHubspotForm;
