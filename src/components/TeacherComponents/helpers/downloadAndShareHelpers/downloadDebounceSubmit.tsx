import { debounce } from "lodash";

import OakError from "@/errors/OakError";
import errorReporter from "@/common-lib/error-reporter";
import type { ResourceFormValues } from "@/components/TeacherComponents/types/downloadAndShare.types";

const reportError = errorReporter("downloadDebouncedSubmit");

type DownloadData = { data: ResourceFormValues };
export type DownloadDebouncedSubmitProps<
  T extends DownloadData = DownloadData,
> = {
  setIsAttemptingDownload: React.Dispatch<React.SetStateAction<boolean>>;
  setEditDetailsClicked: React.Dispatch<React.SetStateAction<boolean>>;
  onSubmit: (props: T) => Promise<void>;
} & T;

const downloadDebouncedSubmit = async <T extends DownloadData>(
  downloadDebouncedSubmitProps: DownloadDebouncedSubmitProps<T>,
): Promise<void> => {
  const { setIsAttemptingDownload, setEditDetailsClicked, onSubmit } =
    downloadDebouncedSubmitProps;
  try {
    const debouncedFunction = debounce(
      async () => {
        setIsAttemptingDownload(true);
        await onSubmit(downloadDebouncedSubmitProps);
        setIsAttemptingDownload(false);
        setEditDetailsClicked(false);
      },
      4000,
      { leading: true },
    );
    await debouncedFunction();
  } catch (error) {
    const oakError = new OakError({
      code: "downloads/failed-to-fetch",
      originalError: error,
    });
    reportError(oakError);
    throw oakError;
  }
};

export default downloadDebouncedSubmit;
