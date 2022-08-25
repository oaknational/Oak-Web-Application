import { useCallback } from "react";

import { hubspotSubmitForm } from "../../../browser-lib/hubspot/forms";
import { HubspotFormData } from "../../../browser-lib/hubspot/forms/hubspotSubmitForm";
import config from "../../../config";
import useAnalytics from "../../../context/Analytics/useAnalytics";
import useAnonymousId from "../../../hooks/useAnonymousId";

const hubspotNewsletterFormId = config.get("hubspotNewsletterFormId");

const useNewsletterForm = () => {
  const anonymousId = useAnonymousId();

  const { identify } = useAnalytics();
  const onSubmit = useCallback(
    (data: HubspotFormData) => {
      const hubspotFormResponse = hubspotSubmitForm({
        hubspotFormId: hubspotNewsletterFormId,
        data,
      });

      identify(anonymousId, { email: data.email || data.emailTextOnly });

      return hubspotFormResponse;
    },
    [identify, anonymousId]
  );
  return { onSubmit };
};

export default useNewsletterForm;
