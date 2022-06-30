import { useCallback } from "react";

import { hubspotSubmitForm } from "../../../browser-lib/hubspot/forms";
import { HubspotFormData } from "../../../browser-lib/hubspot/forms/hubspotSubmitForm";
import config from "../../../config";

const hubspotNewsletterFormId = config.get("hubspotNewsletterFormId");

const useNewsletterForm = () => {
  const onSubmit = useCallback((data: HubspotFormData) => {
    return hubspotSubmitForm({
      hubspotFormId: hubspotNewsletterFormId,
      data,
    });
  }, []);
  return { onSubmit };
};

export default useNewsletterForm;
