import { useEffect, useState } from "react";

import errorReporter from "@/common-lib/error-reporter";
import downloadLessonResources from "@/components/SharedComponents/helpers/downloadAndShareHelpers/downloadLessonResources";
import { fetchHubspotContactDetails } from "@/components/TeacherComponents/helpers/downloadAndShareHelpers/fetchHubspotContactDetails";
import { useHubspotSubmit } from "@/components/TeacherComponents/hooks/downloadAndShareHooks/useHubspotSubmit";
import useLocalStorageForDownloads from "@/components/TeacherComponents/hooks/downloadAndShareHooks/useLocalStorageForDownloads";
import { ResourcesToDownloadArrayType } from "@/components/TeacherComponents/types/downloadAndShare.types";
import { useOakNotificationsContext } from "@/context/OakNotifications/useOakNotificationsContext";
import OakError from "@/errors/OakError";

const reportError = errorReporter("EYFS lesson download");

const useSchoolData = () => {
  const { schoolFromLocalStorage, setSchoolInLocalStorage } =
    useLocalStorageForDownloads();

  const [schoolName, setSchoolName] = useState<string | undefined>();
  const [schoolId, setSchoolId] = useState<string | undefined>();

  useEffect(() => {
    const { schoolName, schoolId } = schoolFromLocalStorage;
    if (schoolName) {
      setSchoolName(schoolName);
    }
    if (schoolId) {
      setSchoolId(schoolId);
    }

    if (!schoolId || !schoolName) {
      const getSchoolFromHubspot = async () => {
        const hubspotContact = await fetchHubspotContactDetails();
        if (hubspotContact) {
          const schoolUrn = hubspotContact.schoolId;
          // @sonar-ignore
          // current sonar rule typescript:S6606 incorrectly flags this, see open issue here https://sonarsource.atlassian.net/browse/JS-373
          const schoolName = hubspotContact.schoolName || "notListed";
          // @sonar-end

          // hubspot stores schoolUrn isolated from schoolName, but we need to store them together in local storage
          const schoolId = schoolUrn
            ? `${schoolUrn}-${schoolName}`
            : "notListed";

          const school = {
            schoolId,
            schoolName,
          };
          setSchoolInLocalStorage(school);
          if (schoolName) {
            setSchoolName(schoolName);
          }
          if (schoolId) {
            setSchoolId(schoolId);
          }
        }
      };
      getSchoolFromHubspot();
    }
  }, [schoolFromLocalStorage, setSchoolInLocalStorage]);

  return { schoolName, schoolId };
};

export const useEyfsLessonDownload = ({
  lessonSlug,
  downloadableResources,
}: {
  lessonSlug: string;
  downloadableResources: ResourcesToDownloadArrayType;
}) => {
  const { setCurrentToastProps } = useOakNotificationsContext();

  const { schoolName, schoolId } = useSchoolData();

  const { onHubspotSubmit } = useHubspotSubmit();

  const onDownload = async () => {
    try {
      onHubspotSubmit({
        school: schoolId ?? "",
        schoolName: schoolName,
        resources: downloadableResources,
        terms: true,
      });
      await downloadLessonResources({
        lessonSlug: lessonSlug,
        selectedResourceTypes: downloadableResources,
        isLegacyDownload: true,
      });
      setCurrentToastProps({
        message: "Download successful",
        variant: "success",
        showIcon: true,
        autoDismiss: true,
      });
    } catch (err) {
      setCurrentToastProps({
        message:
          "Something went wrong with the download. Try refreshing the page.",
        variant: "error",
        showIcon: true,
        autoDismiss: true,
      });
      const error = new OakError({
        code: "downloads/failed-to-fetch",
        meta: { lessonSlug, err },
      });
      reportError(error);
    }
  };

  return {
    onDownload,
  };
};
