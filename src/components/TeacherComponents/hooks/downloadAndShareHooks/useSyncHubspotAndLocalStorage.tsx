import { useUser } from "@clerk/nextjs";
import { useState, useEffect } from "react";
import { UseFormSetValue } from "react-hook-form";

import { fetchHubspotContactDetails } from "../../helpers/downloadAndShareHelpers/fetchHubspotContactDetails";
import {
  getSchoolUrn,
  getSchoolOption,
} from "../../helpers/downloadAndShareHelpers/getFormattedDetailsForTracking";

import useLocalStorageForDownloads from "./useLocalStorageForDownloads";

import errorReporter from "@/common-lib/error-reporter";
import OakError from "@/errors/OakError";

type HubspotSchool = {
  schoolId: string;
  schoolName: string;
};

const reportError = errorReporter("fetchHubspotContact");

const getHubspotSchool = (hubspotContact: {
  schoolId?: string | null;
  schoolName?: string | null;
}) => {
  const schoolUrn = hubspotContact.schoolId || "";
  // @sonar-ignore
  // current sonar rule typescript:S6606 incorrectly flags this, see open issue here https://sonarsource.atlassian.net/browse/JS-373
  const schoolName = hubspotContact.schoolName || "notListed";
  // @sonar-end

  const schoolId = schoolUrn ? `${schoolUrn}-${schoolName}` : "notListed";

  return {
    schoolId,
    schoolName,
  };
};

export const useSyncHubspotAndLocalStorage = ({
  setValue,
}: {
  setValue: UseFormSetValue<{
    school: string;
    terms: true;
    resources: string[];
    schoolName?: string;
    email?: string;
  }>;
}) => {
  const { isSignedIn, user } = useUser();
  const userEmail = user?.emailAddresses?.[0]?.emailAddress;
  const isOnboarded = !!user?.publicMetadata?.owa?.isOnboarded;

  const [hubspotLoaded, setHubspotLoaded] = useState(false);
  const [hubspotLookupCompleted, setHubspotLookupCompleted] = useState(false);
  const [schoolFromHubspot, setSchoolFromHubspot] =
    useState<HubspotSchool | null>(null);

  const [isLocalStorageLoading, setIsLocalStorageLoading] = useState(true);
  const [schoolUrn, setSchoolUrn] = useState("");

  const {
    schoolFromLocalStorage,
    emailFromLocalStorage,
    termsFromLocalStorage,
    hasDetailsFromLocalStorage,
    setEmailInLocalStorage,
    setSchoolInLocalStorage,
    setTermsInLocalStorage,
  } = useLocalStorageForDownloads();

  useEffect(() => {
    setIsLocalStorageLoading(false);
  }, [hasDetailsFromLocalStorage]);

  const {
    schoolName: schoolNameFromLocalStorage,
    schoolId: schoolIdFromLocalStorage,
  } = schoolFromLocalStorage;

  // Sync values in localstorage with ones in hubspot for signed in users
  useEffect(() => {
    let cancelled = false;

    const syncSignedInUserWithHubspot = async (email: string) => {
      try {
        const hubspotContact = await fetchHubspotContactDetails();
        if (cancelled) return;

        setTermsInLocalStorage(true);
        setValue("terms", true);

        setEmailInLocalStorage(email);
        setValue("email", email);

        if (hubspotContact) {
          const school = getHubspotSchool(hubspotContact);

          setSchoolInLocalStorage(school);
          setSchoolFromHubspot(school);

          setValue("schoolName", school.schoolName);
          setValue("school", school.schoolId);
        }
      } catch (err) {
        const error = new OakError({
          code: "hubspot/contacts",
          originalError: err,
        });
        reportError(error);
      } finally {
        if (!cancelled) {
          setHubspotLookupCompleted(true);
        }
      }
    };

    if (isSignedIn && userEmail) {
      syncSignedInUserWithHubspot(userEmail);
    } else {
      setHubspotLookupCompleted(true);
    }

    return () => {
      cancelled = true;
    };
  }, [
    isSignedIn,
    userEmail,
    setEmailInLocalStorage,
    setSchoolInLocalStorage,
    setTermsInLocalStorage,
    setValue,
  ]);

  // Keep form values up to date with localstorage
  useEffect(() => {
    if (emailFromLocalStorage) {
      setValue("email", emailFromLocalStorage);
    }

    if (termsFromLocalStorage) {
      setValue("terms", termsFromLocalStorage);
    }

    if (schoolIdFromLocalStorage) {
      setValue("school", schoolIdFromLocalStorage);
      const schoolUrn = getSchoolUrn(
        schoolIdFromLocalStorage,
        getSchoolOption(schoolIdFromLocalStorage),
      );
      setSchoolUrn(schoolUrn);
    }
  }, [
    emailFromLocalStorage,
    schoolIdFromLocalStorage,
    setValue,
    termsFromLocalStorage,
  ]);

  // Set finished loading when local storage matches hubspot or when no details expected in hubspot
  useEffect(() => {
    const schoolDetailsMatch =
      schoolFromHubspot?.schoolId === schoolFromLocalStorage.schoolId &&
      schoolFromHubspot?.schoolName === schoolFromLocalStorage.schoolName;

    const userDoesNotNeedHubspotSync = !isSignedIn || !isOnboarded;
    const noSchoolFromHubspot = hubspotLookupCompleted && !schoolFromHubspot;

    if (
      (schoolDetailsMatch ||
        userDoesNotNeedHubspotSync ||
        noSchoolFromHubspot) &&
      !hubspotLoaded
    ) {
      setHubspotLoaded(true);
    }
  }, [
    schoolFromHubspot,
    schoolFromLocalStorage,
    isSignedIn,
    hubspotLoaded,
    hubspotLookupCompleted,
    isOnboarded,
  ]);

  return {
    emailFromLocalStorage,
    schoolNameFromLocalStorage,
    schoolIdFromLocalStorage,
    hasDetailsFromLocalStorage,
    schoolUrn,
    isLocalStorageLoading,
    hubspotLoaded,
    setEmailInLocalStorage,
    setSchoolInLocalStorage,
    setTermsInLocalStorage,
    setSchoolUrn,
  };
};
