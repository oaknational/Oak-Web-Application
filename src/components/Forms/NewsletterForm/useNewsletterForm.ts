import config from "../../../config/browser";
import useHubspotForm from "../HubspotForm/useHubspotForm";

const hubspotNewsletterFormId = config.get("hubspotNewsletterFormId");

type UseNewsletterFormProps = {
  onSubmit?: () => void;
};

const useNewsletterForm = (props: UseNewsletterFormProps = {}) => {
  return useHubspotForm({ ...props, formId: hubspotNewsletterFormId });
};

export default useNewsletterForm;
