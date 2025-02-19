import { debounce } from "lodash";

import OakError from "@/errors/OakError";
import {
  ResourceFormProps,
  ResourceFormWithRiskAssessmentProps,
} from "@/components/TeacherComponents/types/downloadAndShare.types";
import errorReporter from "@/common-lib/error-reporter";

const reportError = errorReporter("downloadDebouncedSubmit");

export type DownloadDebouncedSubmitProps = {
  data: ResourceFormProps | ResourceFormWithRiskAssessmentProps;
  lessonSlug: string;
  setIsAttemptingDownload: React.Dispatch<React.SetStateAction<boolean>>;
  setEditDetailsClicked: React.Dispatch<React.SetStateAction<boolean>>;
  onSubmit: (
    data: ResourceFormProps | ResourceFormWithRiskAssessmentProps,
    lessonSlug: string,
  ) => Promise<void>;
};

const downloadDebouncedSubmit = async (
  downloadDebouncedSubmitProps: DownloadDebouncedSubmitProps,
): Promise<void> => {
  const {
    data,
    lessonSlug,
    setIsAttemptingDownload,
    setEditDetailsClicked,
    onSubmit,
  } = downloadDebouncedSubmitProps;
  try {
    const debouncedFunction = debounce(
      async () => {
        setIsAttemptingDownload(true);
        await onSubmit(data, lessonSlug);
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
