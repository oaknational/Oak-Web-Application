import { Client as HubspotClient } from "@hubspot/api-client";
import { currentUser } from "@clerk/nextjs/server";
import { z } from "zod";

export const contactResponseSchema = z.object({
  schoolName: z.string(),
  schoolId: z.string(),
});

export function createHandler(hubspotClient: HubspotClient) {
  return async function handler() {
    const user = await currentUser();

    if (!user) {
      return new Response(null, { status: 401 });
    }

    const email = user.primaryEmailAddress?.emailAddress;

    if (!email) {
      return new Response(null, { status: 204 });
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

      return Response.json(contact);
    } catch (error) {
      if (error instanceof Error && "code" in error) {
        if (error.code === 404) {
          return new Response(null, { status: 204 }); // No content
        }
      }

      throw error;
    }
  };
}
