import { ResourceFormValues } from "../../types/downloadAndShare.types";

import usePersistResourceFormDetails from "./usePersistResourceFormDetails";

import { createTeachWithOakDownloadLink } from "@/components/SharedComponents/helpers/downloadAndShareHelpers/createDownloadLink";
import createAndClickHiddenDownloadLink from "@/components/SharedComponents/helpers/downloadAndShareHelpers/createAndClickHiddenDownloadLink";
import { useTeacherBrowseAnalytics } from "@/context/TeacherBrowseAnalytics/TeacherBrowseAnalyticsProvider";

const useTeachWithOakDownload = () => {
  const { persistResourceFormDetails } = usePersistResourceFormDetails();
  const { teachWithOakDownloaded } = useTeacherBrowseAnalytics(
    (store) => store.track,
  );

  const onSubmit = async ({ data }: { data: ResourceFormValues }) => {
    persistResourceFormDetails(data);

    const downloadLink = await createTeachWithOakDownloadLink();
    createAndClickHiddenDownloadLink(downloadLink);
    teachWithOakDownloaded();
  };

  return { onSubmit };
};

export default useTeachWithOakDownload;
