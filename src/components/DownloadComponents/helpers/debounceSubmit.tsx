import { debounce } from "lodash";

import OakError from "../../../errors/OakError";
import { DownloadFormProps } from "../downloads.types";

const debouncedSubmit = async (
  data: DownloadFormProps,
  lessonSlug: string,
  setIsAttemptingDownload: React.Dispatch<React.SetStateAction<boolean>>,
  setEditDetailsClicked: React.Dispatch<React.SetStateAction<boolean>>,
  onSubmit: (data: DownloadFormProps, lessonSlug: string) => Promise<void>
): Promise<void> => {
  await debounce(
    async () => {
      try {
        setIsAttemptingDownload(true);
        await onSubmit(data, lessonSlug);

        setIsAttemptingDownload(false);
        setEditDetailsClicked(false);
      } catch (error) {
        const oakError = new OakError({
          code: "downloads/failed-to-fetch",
          originalError: error,
        });

        reportError(oakError);
      }
    },
    4000,
    { leading: true }
  )();
};

export default debouncedSubmit;
