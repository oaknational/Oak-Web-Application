import { z } from "zod";

import OakError from "@/errors/OakError";
import getBrowserConfig from "@/browser-lib/getBrowserConfig";

const DOWNLOADS_API_URL = getBrowserConfig("downloadApiUrl");

/**
 * Expected response schema
 */
const schema = z.object({
  data: z.object({
    exists: z.boolean(),
    fileSize: z.string().optional(),
  }),
  error: z
    .object({
      message: z.string(),
    })
    .optional(),
});

export type DownloadsApiUnitCheckFilesResponseSchema = z.infer<typeof schema>;

const getUnitDownloadResourcesExistence = async (unitProgrammeSlug: string) => {
  const checkWhichResourcesExistEndpoint = `${DOWNLOADS_API_URL}/api/unit/${unitProgrammeSlug}/check-files`;

  const meta = {
    unitProgrammeSlug,
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

export default getUnitDownloadResourcesExistence;
