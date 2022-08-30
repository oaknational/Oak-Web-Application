import { hubspotSubmitForm } from "../../../browser-lib/hubspot/forms";
import { HubspotFormData } from "../../../browser-lib/hubspot/forms/hubspotSubmitForm";
import config from "../../../config";

const hubspotNewsletterFormId = config.get("hubspotNewsletterFormId");

type UseNewsletterFormProps = {
  onSubmit?: () => void;
};
const useNewsletterForm = (props: UseNewsletterFormProps = {}) => {
  const onSubmit = (data: HubspotFormData) => {
    if (props.onSubmit) {
      props.onSubmit();
    }

    return hubspotSubmitForm({
      hubspotFormId: hubspotNewsletterFormId,
      data,
    });
  };

  return { onSubmit };
};

export default useNewsletterForm;
