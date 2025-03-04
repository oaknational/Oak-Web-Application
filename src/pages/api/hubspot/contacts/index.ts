import { Client as HubspotClient } from "@hubspot/api-client";
import { NextApiRequest, NextApiResponse } from "next";
import { z } from "zod";
import { getAuth, clerkClient } from "@clerk/nextjs/server";

import getServerConfig from "@/node-lib/getServerConfig";

export const contactResponseSchema = z.object({
  schoolName: z.string(),
  schoolId: z.string(),
});

export function createHandler(hubspotClient: HubspotClient) {
  return async function handler(req: NextApiRequest, res: NextApiResponse) {
    const auth = getAuth(req);

    if (!auth.userId) {
      return res.status(401).send("Unauthorized");
    }

    const client = await clerkClient();

    const email = (await client.users.getUser(auth.userId)).primaryEmailAddress
      ?.emailAddress;

    if (!email) {
      return res.status(204).end();
    }

    const contactId = email;
    const properties = ["contact_school_name", "contact_school_urn"];

    const idProperty = "email";
    // An error is thrown from the HubSpot API if the following props are not set
    const propertiesWithHistory = undefined;
    const associations = undefined;
    const archived = false;
    try {
      const apiResponse = await hubspotClient.crm.contacts.basicApi.getById(
        contactId,
        properties,
        propertiesWithHistory,
        associations,
        archived,
        idProperty,
      );

      const contact = {
        email: apiResponse.properties.email,
        schoolName: apiResponse.properties.contact_school_name,
        schoolId: apiResponse.properties.contact_school_urn,
        hadSharedOrDownloaded:
          apiResponse.properties.last_shared_downloaded_a_owa_resource,
      };

      return res.status(200).json(contact);
    } catch (error) {
      if (error instanceof Error && "code" in error) {
        if (error.code === 404) {
          return res.status(204).end(); // No content
        }
      }

      return res.status(500).json({ error: JSON.stringify(error) });
    }
  };
}

export default createHandler(
  new HubspotClient({
    accessToken: getServerConfig("hubspotOwaAccessToken"),
  }),
);
