import { z } from "zod";

import OakError from "@/errors/OakError";
import getBrowserConfig from "@/browser-lib/getBrowserConfig";

const LEGACY_DOWNLOADS_API_URL = getBrowserConfig("vercelApiUrl");
const DOWNLOADS_API_URL = getBrowserConfig("downloadApiUrl");

/**
 * Expected response schema
 */
const schema = z.object({
  data: z
    .object({
      url: z.string(),
    })
    .optional(),
  error: z
    .object({
      message: z.string(),
    })
    .optional(),
});
export type DownloadsApiDownloadResponseSchema = z.infer<typeof schema>;

const createDownloadResourcesLink = async (
  lessonSlug: string,
  selection: string,
  isLegacyDownload: boolean,
) => {
  const downloadEnpoint = isLegacyDownload
    ? `${LEGACY_DOWNLOADS_API_URL}/api/downloads/lesson/${lessonSlug}?selection=${selection}`
    : `${DOWNLOADS_API_URL}/api/lesson/${lessonSlug}/download?selection=${selection}`;

  const meta = {
    lessonSlug,
    selection,
    isLegacyDownload,
  };
  const res = await fetch(downloadEnpoint);

  if (!res.ok) {
    throw new OakError({
      code: "downloads/failed-to-fetch",
      meta,
    });
  }
  const json = await res.json();

  const parsedJson = schema.safeParse(json);

  if (!parsedJson.success) {
    throw new OakError({
      code: "downloads/failed-to-fetch",
      originalError: parsedJson.error,
      meta: {
        ...meta,
        type: "zod error",
        error: parsedJson.error.message,
      },
    });
  }

  const { data, error } = parsedJson.data;

  if (!data || error) {
    throw new OakError({
      code: "downloads/failed-to-fetch",
      meta: {
        ...meta,
        error,
      },
    });
  }

  return data.url;
};

export default createDownloadResourcesLink;
