import { z } from "zod";

import OakError from "@/errors/OakError";

const contactDetails = z.object({
  email: z.string(),
  schoolName: z.string().nullish(),
  schoolId: z.string().nullish(),
});

export async function fetchHubspotContactDetails(email: string) {
  try {
    const response = await fetch(`/api/hubspot/contacts`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });
    if (!response.ok) {
      throw new Error("Failed to fetch contact details");
    }

    const result = contactDetails.parse(await response.json());

    return result;
  } catch (err) {
    if (err instanceof OakError) {
      throw err;
    }
    throw new OakError({
      code: "hubspot/unknown",
      originalError: err,
    });
  }
}
