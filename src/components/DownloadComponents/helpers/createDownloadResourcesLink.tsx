import { z } from "zod";

import OakError from "@/errors/OakError";

if (!process.env.NEXT_PUBLIC_VERCEL_API_URL) {
  throw new TypeError("process.env.NEXT_PUBLIC_VERCEL_API_URL must be defined");
}
if (!process.env.NEXT_PUBLIC_DOWNLOAD_API_URL) {
  throw new TypeError(
    "process.env.NEXT_PUBLIC_DOWNLOAD_API_URL must be defined",
  );
}

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
    ? `${process.env.NEXT_PUBLIC_VERCEL_API_URL}/api/downloads/lesson/${lessonSlug}?selection=${selection}`
    : `${process.env.NEXT_PUBLIC_DOWNLOAD_API_URL}/api/lesson/${lessonSlug}/download?selection=${selection}`;

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
      code: "downloads/check-files-failed",
      meta: {
        ...meta,
        error,
      },
    });
  }

  return data.url;
};

export default createDownloadResourcesLink;
