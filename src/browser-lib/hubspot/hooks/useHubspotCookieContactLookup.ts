import { useState, useEffect } from "react";

import getHubspotUserToken from "../forms/getHubspotUserToken";

/**
 * Hook for looking up HubSpot contact data using the hubspot cookie
 * Works for both authenticated and unauthenticated users
 */
export const useHubspotCookieContactLookup = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [contactData, setContactData] = useState<Record<
    string,
    unknown
  > | null>(null);

  const lookupContactByCookie = async () => {
    const hubspotutk = getHubspotUserToken();

    if (!hubspotutk) {
      console.info(
        "No HubSpot cookie found, user likely has not interacted with HubSpot",
      );
      return null;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/hubspot/contact-lookup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ hubspotutk }),
      });

      if (!response.ok) {
        throw new Error(`Failed to lookup contact: ${response.statusText}`);
      }

      const data = await response.json();

      setContactData(data.contact);
      if (data.contact) {
        console.log("HubSpot contact data:", data.contact);
        console.log("HubSpot contact ID:", data.contact.id);
      }
      return data.contact;
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      console.error("Error looking up HubSpot contact by cookie:", error);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // This will log the contact data whenever the hook is used
  useEffect(() => {
    lookupContactByCookie();
  }, []);

  return {
    lookupContactByCookie,
    contactData,
    isLoading,
    error,
  };
};
