import { z } from "zod";

import OakError from "@/errors/OakError";
import getBrowserConfig from "@/browser-lib/getBrowserConfig";

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

const createUnitDownloadLink = async ({
  unitSlug,
  authFlagEnabled,
  authToken,
}: {
  unitSlug: string;
  authFlagEnabled?: boolean;
  authToken?: string | null;
}) => {
  const downloadEnpoint = `${DOWNLOADS_API_URL}/api/unit/${unitSlug}/download`;

  const meta = {
    unitSlug,
  };

  const authHeader = authToken
    ? { Authorization: `Bearer ${authToken}` }
    : undefined;

  const res = await fetch(downloadEnpoint, {
    headers: {
      ...authHeader,
      "X-Should-Authenticate-Download": JSON.stringify(
        Boolean(authFlagEnabled),
      ),
    },
  });

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

export default createUnitDownloadLink;
