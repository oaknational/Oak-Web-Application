import { ResourceFormValues } from "../../types/downloadAndShare.types";

import usePersistResourceFormDetails from "./usePersistResourceFormDetails";

import { createTeachWithOakDownloadLink } from "@/components/SharedComponents/helpers/downloadAndShareHelpers/createDownloadLink";
import createAndClickHiddenDownloadLink from "@/components/SharedComponents/helpers/downloadAndShareHelpers/createAndClickHiddenDownloadLink";

const useTeachWithOakDownload = () => {
  const { persistResourceFormDetails } = usePersistResourceFormDetails();

  const onSubmit = async ({ data }: { data: ResourceFormValues }) => {
    persistResourceFormDetails(data);

    const downloadLink = await createTeachWithOakDownloadLink();
    createAndClickHiddenDownloadLink(downloadLink);
  };

  return { onSubmit };
};

export default useTeachWithOakDownload;
