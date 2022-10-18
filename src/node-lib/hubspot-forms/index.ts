import Hubspot from "hubspot";

import config from "../../config";

import { HubspotFormDefinition } from "./HubspotFormDefinition";

const hubspot = new Hubspot({
  accessToken: config.get("hubspotFormsAccessToken"),
});

export const getHubspotFormById = async (
  formId: string
): Promise<HubspotFormDefinition> => {
  const formResponse = await hubspot.forms.getById(formId);
  return formResponse;
};
