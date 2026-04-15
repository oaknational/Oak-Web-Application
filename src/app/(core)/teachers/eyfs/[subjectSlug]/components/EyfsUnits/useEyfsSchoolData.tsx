import { useEffect } from "react";

import { useFetchHubspotContactsSwr } from "@/components/TeacherComponents/helpers/downloadAndShareHelpers/fetchHubspotContactDetails";
import useLocalStorageForDownloads from "@/components/TeacherComponents/hooks/downloadAndShareHooks/useLocalStorageForDownloads";

const getSchoolFromHubspot = (
  contact: ReturnType<typeof useFetchHubspotContactsSwr>["hubspotContact"],
) => {
  if (!contact) return null;
  const schoolUrn = contact.schoolId;
  const schoolName = contact.schoolName || "notListed";
  const schoolId = schoolUrn ? `${schoolUrn}-${schoolName}` : "notListed";
  return { schoolName, schoolId };
};

export const useEyfsSchoolData = () => {
  const { schoolFromLocalStorage, setSchoolInLocalStorage } =
    useLocalStorageForDownloads();
  const { hubspotContact } = useFetchHubspotContactsSwr();
  useEffect(() => {
    const school = getSchoolFromHubspot(hubspotContact);
    if (school) setSchoolInLocalStorage(school);
  }, [hubspotContact, setSchoolInLocalStorage]);
  // Prefer hubspot data, but fallback to local storage if already primed
  return getSchoolFromHubspot(hubspotContact) ?? schoolFromLocalStorage;
};
