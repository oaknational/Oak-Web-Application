import { debounce } from "lodash";

import { OnSubmitProps } from "../../hooks/downloadAndShareHooks/useResourceFormSubmit";

import OakError from "@/errors/OakError";
import errorReporter from "@/common-lib/error-reporter";

const reportError = errorReporter("downloadDebouncedSubmit");

export type DownloadDebouncedSubmitProps = {
  setIsAttemptingDownload: React.Dispatch<React.SetStateAction<boolean>>;
  setEditDetailsClicked: React.Dispatch<React.SetStateAction<boolean>>;
  onSubmit: (props: OnSubmitProps) => Promise<void>;
} & OnSubmitProps;

const downloadDebouncedSubmit = async (
  downloadDebouncedSubmitProps: DownloadDebouncedSubmitProps,
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
