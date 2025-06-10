import { useLayoutEffect, useState } from "react";

import { CurriculumDownloadViewData } from "../../CurriculumComponents/CurriculumDownloadView";
import {
  saveDownloadsDataToLocalStorage,
  useDownloadsLocalStorage,
} from "../../CurriculumComponents/CurriculumDownloadTab/helper";
import { createCurriculumDownloadsQuery } from "../../CurriculumComponents/CurriculumDownloadTab";

import { downloadFileFromUrl } from "./helpers";

type useCurriculumDownloadsProps = {
  mvRefreshTime: number;
  phaseSlug: string;
  subjectSlug: string;
  ks4OptionSlug: string | null;
  tierSlug: string | null;
};

const useCurriculumDownloads = (props: useCurriculumDownloadsProps) => {
  const { mvRefreshTime, phaseSlug, subjectSlug, ks4OptionSlug, tierSlug } =
    props;

  const [data, setData] = useState<CurriculumDownloadViewData>(() => ({
    schoolId: undefined,
    schoolName: undefined,
    email: undefined,
    downloadType: "word",
    termsAndConditions: false,
    schoolNotListed: false,
    schools: [],
  }));
  const { data: localStorageData } = useDownloadsLocalStorage();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const hasSavedDetails =
    ((data.schoolId && data.schoolName) || data.schoolNotListed === true) &&
    data.termsAndConditions === true;

  useLayoutEffect(() => {
    if (localStorageData) {
      setData({
        schoolId: localStorageData.schoolId,
        schoolName: localStorageData.schoolName,
        email: localStorageData.email,
        downloadType: "word",
        termsAndConditions: localStorageData.termsAndConditions,
        schoolNotListed: localStorageData.schoolNotListed,
        schools: [],
      });
    }
  }, [localStorageData]);

  const onSubmit = async () => {
    setIsSubmitting(true);

    const query = createCurriculumDownloadsQuery(
      "published",
      mvRefreshTime,
      subjectSlug,
      phaseSlug,
      ks4OptionSlug,
      tierSlug,
      null,
    );
    const downloadPath = `/api/curriculum-downloads/?${query}`;

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
    } finally {
      // TODO: tracking
      //   await trackCurriculumDownload(
      //     data,
      //     subjectTitle,
      //     onHubspotSubmit,
      //     track,
      //     analyticsUseCase,
      //     slugs,
      //   );
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
