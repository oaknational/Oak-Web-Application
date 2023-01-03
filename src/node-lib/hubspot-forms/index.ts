import { Client as HubspotClient } from "@hubspot/api-client";

import config from "../../config/server";
import { FormDefinition } from "../../common-lib/forms/FormDefinition";

import { transformHubspotForm } from "./transformHubspotForm";

const hubspot = new HubspotClient({
  accessToken: config.get("hubspotFormsAccessToken"),
});

export const getHubspotFormById = async (
  formId: string
): Promise<FormDefinition> => {
  const formResponse = await hubspot.apiRequest({
    method: "get",
    path: `/forms/v2/forms/${formId}`,
  });

  const form = await formResponse.json();

  return transformHubspotForm(form);
};
