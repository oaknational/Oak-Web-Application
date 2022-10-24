import Hubspot from "hubspot";

import config from "../../config";

const hubspot = new Hubspot({
  accessToken: config.get("hubspotFormsAccessToken"),
});

export const getHubspotFormById = async (
  formId: string
): Promise<unknown> => {
  const formResponse = await hubspot.forms.getById(formId);
  return formResponse;
};
