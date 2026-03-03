import { z } from "zod";
import useSWR from "swr";

import OakError from "@/errors/OakError";
import errorReporter from "@/common-lib/error-reporter";

const contactDetails = z.object({
  email: z.string(),
  schoolName: z.string().nullish(),
  schoolId: z.string().nullish(),
});

const reportError = errorReporter("fetchHubspotContactDetails");

export const HUBSPOT_CONTACTS_ENDPOINT = `/api/hubspot/contacts`;

const hubspotContactsFetcher = async (url: string) => {
  try {
    const response = await fetch(url);
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
};

export const useFetchHubspotContactsSwr = () => {
  const { data, isLoading } = useSWR(
    HUBSPOT_CONTACTS_ENDPOINT,
    hubspotContactsFetcher,
  );

  return { hubspotContact: data, hubspotLoading: isLoading };
};

export async function fetchHubspotContactDetails() {
  return hubspotContactsFetcher(HUBSPOT_CONTACTS_ENDPOINT);
}
