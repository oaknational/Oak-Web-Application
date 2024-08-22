import { Client as HubspotClient } from "@hubspot/api-client";

import { FormDefinition } from "../../common-lib/forms/FormDefinition";
import getServerConfig from "../getServerConfig";

import { transformHubspotForm } from "./transformHubspotForm";

const hubspot = new HubspotClient({
  accessToken: getServerConfig("hubspotFormsAccessToken"),
});

export const getHubspotFormById = async (
  formId: string,
): Promise<FormDefinition> => {
  const formResponse = await hubspot.apiRequest({
    method: "get",
    path: `/forms/v2/forms/${formId}`,
  });

  const form = await formResponse.json();

  return transformHubspotForm(form);
};

export async function getContactByEmail(email: string): Promise<unknown> {
  try {
    const response = await hubspot.apiRequest({
      method: "post",
      path: `/crm/v3/objects/contacts/search`,
      body: {
        filterGroups: [
          {
            filters: [
              {
                propertyName: "email",
                operator: "CONTAINS_TOKEN",
                value: email,
              },
            ],
          },
        ],
      },
    });

    if (!response) {
      throw new Error("No response or data from the API.");
    }

    const contact = response;
    return contact;
  } catch (error) {
    console.error("Error retrieving contact by email:", error);
    throw error;
  }
}
