import { useLayoutEffect, useState } from "react";

import { CurriculumDownloadViewData } from "../../CurriculumComponents/CurriculumDownloadView";
import {
  saveDownloadsDataToLocalStorage,
  useDownloadsLocalStorage,
} from "../../CurriculumComponents/CurriculumDownloadTab/helper";
import { extractUrnAndSchool } from "../helpers/downloadAndShareHelpers/getFormattedDetailsForTracking";

import { downloadFileFromUrl } from "@/components/SharedComponents/helpers/downloadFileFromUrl";
import useAnalytics from "@/context/Analytics/useAnalytics";
import { ResourceTypeValueType, PhaseValueType } from "@/browser-lib/avo/Avo";
import { useOakToastContext } from "@/context/OakToast/useOakToastContext";
import { createCurriculumDownloadsUrl } from "@/utils/curriculum/urls";

export type useCurriculumDownloadsProps = {
  mvRefreshTime: number;
  phaseSlug: string;
  subjectSlug: string;
  subjectTitle: string;
  pathwaySlug: string | null;
  tierSlug: string | null;
  childSubjectSlug: string | null;
};

const useCurriculumDownloads = (props: useCurriculumDownloadsProps) => {
  const {
    mvRefreshTime,
    phaseSlug,
    subjectSlug,
    subjectTitle,
    pathwaySlug,
    tierSlug,
    childSubjectSlug,
  } = props;

  const { track } = useAnalytics();
  const { setCurrentToastProps } = useOakToastContext();

  const [data, setData] = useState<CurriculumDownloadViewData>(() => ({
    schoolId: undefined,
    schoolName: undefined,
    email: undefined,
    downloadTypes: ["curriculum-plans"],
    termsAndConditions: false,
    schoolNotListed: false,
    schools: [],
  }));
  const { data: localStorageData } = useDownloadsLocalStorage();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const hasSavedDetails =
    (Boolean(data.schoolId?.length) || Boolean(data.email?.length)) &&
    data.termsAndConditions;

  useLayoutEffect(() => {
    if (localStorageData) {
      setData({
        schoolId: localStorageData.schoolId,
        schoolName: localStorageData.schoolName,
        email: localStorageData.email,
        downloadTypes: ["curriculum-plans"],
        termsAndConditions: localStorageData.termsAndConditions,
        schoolNotListed: localStorageData.schoolNotListed,
        schools: [],
      });
    }
  }, [localStorageData]);

  const onSubmit = async () => {
    setIsSubmitting(true);
    const downloadPath = createCurriculumDownloadsUrl(
      data.downloadTypes[0]!,
      "published",
      mvRefreshTime,
      subjectSlug,
      phaseSlug,
      pathwaySlug,
      tierSlug,
      childSubjectSlug,
    );

    const schoolData = {
      schoolId: data.schoolId!,
      schoolName: data.schoolName!,
      email: data.email!,
      termsAndConditions: data.termsAndConditions!,
      schoolNotListed: data.schoolNotListed!,
    };
    saveDownloadsDataToLocalStorage(schoolData);

    try {
      await downloadFileFromUrl(downloadPath);
    } catch (error) {
      setIsSubmitting(false);
      setCurrentToastProps({
        message: "Something went wrong with your download",
        variant: "error",
        autoDismiss: true,
        showIcon: false,
      });

      return;
    } finally {
      const schoolName =
        data.schoolName === "Homeschool" ? "Homeschool" : "Selected school";
      const schoolOption =
        data.schoolNotListed === true ? "Not listed" : schoolName;

      track.curriculumResourcesDownloaded({
        platform: "owa",
        product: "curriculum resources",
        engagementIntent: "explore",
        componentType: "unit_download_button",
        eventVersion: "2.0.0",
        analyticsUseCase: "Teacher",
        emailSupplied: data.email != null,
        resourceType: ["curriculum document"] as ResourceTypeValueType[],
        schoolOption: schoolOption,
        schoolName: data.schoolName || "",
        subjectTitle: subjectTitle,
        phase: phaseSlug as PhaseValueType,
        schoolUrn:
          !data.schoolId || data.schoolId === "homeschool"
            ? ""
            : (extractUrnAndSchool(data.schoolId).urn ?? ""),
        keyStageSlug: null,
        keyStageTitle: null,
      });
      setIsSubmitting(false);
    }
  };

  return {
    onSubmit,
    isSubmitting,
    hasSavedDetails,
  };
};

export default useCurriculumDownloads;
