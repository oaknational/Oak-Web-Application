import errorReporter from "@/common-lib/error-reporter";
import OakError from "@/errors/OakError";

export const postEducatorData = async (url: string, onErr?: () => void) => {
  const reportError = errorReporter("educatorApi");

  const response = await fetch(url, { method: "POST" });

  if (!response.ok) {
    if (onErr) {
      onErr();
    }
    const error = new OakError({
      code: "educator-api/failed-to-fetch",
      meta: {
        status: response.status,
        statusText: response.statusText,
        queryUrl: url,
      },
    });
    reportError(error);
  }
  return response.ok;
};
