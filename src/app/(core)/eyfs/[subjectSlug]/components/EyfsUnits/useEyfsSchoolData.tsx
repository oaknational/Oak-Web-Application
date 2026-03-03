import { useState, useEffect } from "react";

import { useFetchHubspotContactsSwr } from "@/components/TeacherComponents/helpers/downloadAndShareHelpers/fetchHubspotContactDetails";
import useLocalStorageForDownloads from "@/components/TeacherComponents/hooks/downloadAndShareHooks/useLocalStorageForDownloads";

export const useEyfsSchoolData = () => {
  const { schoolFromLocalStorage, setSchoolInLocalStorage } =
    useLocalStorageForDownloads();

  const { hubspotContact, hubspotLoading } = useFetchHubspotContactsSwr();

  const [schoolName, setSchoolName] = useState<string | undefined>();
  const [schoolId, setSchoolId] = useState<string | undefined>();

  useEffect(() => {
    if (!hubspotLoading) {
      // use details from hubspot by default, they should be available for all signed in onboarded users
      if (hubspotContact) {
        const schoolUrn = hubspotContact.schoolId;
        const schoolNameFromHubspot = hubspotContact.schoolName || "notListed";
        const schoolIdFromHubspot = schoolUrn
          ? `${schoolUrn}-${schoolNameFromHubspot}`
          : "notListed";

        if (schoolNameFromHubspot && schoolIdFromHubspot) {
          const school = {
            schoolId: schoolIdFromHubspot,
            schoolName: schoolNameFromHubspot,
          };
          setSchoolInLocalStorage(school);
          setSchoolName(schoolNameFromHubspot);
          setSchoolId(schoolIdFromHubspot);
        }
      } else {
        // if no details found in hubspot fall back to those from localstorage
        const { schoolName, schoolId } = schoolFromLocalStorage;
        setSchoolName(schoolName);
        setSchoolId(schoolId);
      }
    }
  }, [
    schoolFromLocalStorage,
    setSchoolInLocalStorage,
    hubspotContact,
    hubspotLoading,
  ]);

  return { schoolName, schoolId };
};
