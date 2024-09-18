import { Client as HubspotClient } from "@hubspot/api-client";
import { NextApiRequest, NextApiResponse } from "next";
import { z } from "zod";

import getServerConfig from "@/node-lib/getServerConfig";

const hubspot = new HubspotClient({
  accessToken: getServerConfig("hubspotOwaAccessToken"),
});

export const contactResponseSchema = z.object({
  schoolName: z.string(),
  schoolId: z.string(),
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const email = "joe.baker@thenational.academy";
  const contactId = email;
  const properties = ["contact_school_name", "contact_school_urn"];
  const idProperty = "email";
  // An error is thrown from the HubSpot API if the following props are not set
  const propertiesWithHistory = undefined;
  const associations = undefined;
  const archived = false;
  try {
    const apiResponse = await hubspot.crm.contacts.basicApi.getById(
      contactId,
      properties,
      propertiesWithHistory,
      associations,
      archived,
      idProperty,
    );

    const contact = contactResponseSchema.parse({
      email: apiResponse.properties.email,
      schoolName: apiResponse.properties.contact_school_name,
      schoolId: apiResponse.properties.contact_school_urn,
    });
    // const contact = contactResponseSchema.parse({
    //   email: "made up",
    //   schoolName: "made up",
    //   schoolId: ",made up",
    // });

    return res.status(200).json(contact);
  } catch (error) {
    return res.status(500).json({ error: JSON.stringify(error) });
  }
}
