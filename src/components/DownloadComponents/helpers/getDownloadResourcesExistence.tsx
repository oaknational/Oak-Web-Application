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
      resources: z.array(
        z.tuple([
          z.string(),
          z.object({
            exists: z.boolean(),
            errors: z
              .array(
                z.object({
                  message: z.string(),
                }),
              )
              .optional(),
          }),
        ]),
      ),
    })
    .optional(),
  error: z
    .object({
      message: z.string(),
    })
    .optional(),
});
export type DownloadsApiCheckFilesResponseSchema = z.infer<typeof schema>;

const getDownloadResourcesExistence = async (
  lessonSlug: string,
  resourceTypesString: string,
  isLegacyDownload: boolean,
) => {
  const checkWhichResourcesExistEndpoint = isLegacyDownload
    ? `${LEGACY_DOWNLOADS_API_URL}/api/downloads/lesson/${lessonSlug}/check-files?selection=${resourceTypesString}`
    : `${DOWNLOADS_API_URL}/api/lesson/${lessonSlug}/check-files?selection=${resourceTypesString}`;

  const meta = {
    lessonSlug,
    resourceTypesString,
    isLegacyDownload,
  };
  const res = await fetch(checkWhichResourcesExistEndpoint);

  if (!res.ok) {
    throw new OakError({
      code: "downloads/check-files-failed",
      meta,
    });
  }

  const json = await res.json();

  const parsedJson = schema.safeParse(json);

  if (!parsedJson.success) {
    throw new OakError({
      code: "downloads/check-files-failed",
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

  return data;
};

export default getDownloadResourcesExistence;
