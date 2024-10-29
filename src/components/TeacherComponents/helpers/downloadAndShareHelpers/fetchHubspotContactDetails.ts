import { z } from "zod";

import OakError from "@/errors/OakError";
import errorReporter from "@/common-lib/error-reporter";

const contactDetails = z.object({
  email: z.string(),
  schoolName: z.string().nullish(),
  schoolId: z.string().nullish(),
});

const reportError = errorReporter("fetchHubspotContactDetails");

export async function fetchHubspotContactDetails() {
  try {
    const response = await fetch(`/api/hubspot/contacts`, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      throw new Error("Failed to fetch contact details");
    }

    if (response.status === 204) {
      return null;
    }

    const result = contactDetails.parse(await response.json());

    return result;
  } catch (err) {
    const error =
      err instanceof OakError
        ? err
        : new OakError({
            code: "hubspot/unknown",
            originalError: err,
          });

    reportError(error);

    throw error;
  }
}
