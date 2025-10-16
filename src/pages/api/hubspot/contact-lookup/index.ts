import { NextApiRequest, NextApiResponse } from "next";
import { Client as HubspotClient } from "@hubspot/api-client";
import { z } from "zod";

import getServerConfig from "@/node-lib/getServerConfig";

// Request schema validation for email-based lookup
const emailLookupSchema = z.object({
  email: z.string().email(),
});

// Request schema validation for cookie-based lookup
const cookieLookupSchema = z.object({
  hubspotutk: z.string(),
});

export const getHubspotContactByEmail = async (
  hubspotClient: HubspotClient,
  email: string,
) => {
  try {
    const result = await hubspotClient.crm.contacts.basicApi.getById(
      email,
      undefined,
      undefined,
      undefined,
      false,
      "email",
    );
    return result;
  } catch (e: unknown) {
    // Check if error is from HubSpot API with 404 code
    if (e && typeof e === "object" && "code" in e && e.code === 404) {
      return null;
    }
    throw e;
  }
};

export const getHubspotContactByCookie = async (
  hubspotClient: HubspotClient,
  hubspotutk: string,
) => {
  try {
    // First get the contact ID from the cookie
    const contactIds = await hubspotClient.apiRequest({
      method: "get",
      path: `/contacts/v1/contact/utk/${hubspotutk}/profile`,
    });

    const contactData = await contactIds.json();

    // If no email is found for the cookie, return null
    if (!contactData.properties?.email?.value) {
      return null;
    }

    // Now get the full contact details using the email
    return getHubspotContactByEmail(
      hubspotClient,
      contactData.properties.email.value,
    );
  } catch (e: unknown) {
    // Check if error is from HubSpot API with 404 code
    if (e && typeof e === "object" && "code" in e && e.code === 404) {
      return null;
    }
    throw e;
  }
};

export function createHandler(hubspotClient: HubspotClient) {
  return async function handler(req: NextApiRequest, res: NextApiResponse) {
    // Only allow POST requests
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method not allowed" });
    }

    try {
      // Check if we're using email-based or cookie-based lookup
      const body = req.body;

      // Try email-based lookup first
      if ("email" in body) {
        const { email } = emailLookupSchema.parse(body);
        const contact = await getHubspotContactByEmail(hubspotClient, email);
        return res.status(200).json({ contact });
      }
      // Try cookie-based lookup
      else if ("hubspotutk" in body) {
        const { hubspotutk } = cookieLookupSchema.parse(body);
        const contact = await getHubspotContactByCookie(
          hubspotClient,
          hubspotutk,
        );
        return res.status(200).json({ contact });
      }
      // No valid lookup method found
      else {
        return res.status(400).json({
          error: "Invalid request",
          details: "Request must include either email or hubspotutk",
        });
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res
          .status(400)
          .json({ error: "Invalid request", details: error.errors });
      }

      console.error("Error looking up HubSpot contact:", error);
      return res.status(500).json({ error: "Failed to lookup contact" });
    }
  };
}

export default createHandler(
  new HubspotClient({
    accessToken: getServerConfig("hubspotOwaAccessToken"),
  }),
);
