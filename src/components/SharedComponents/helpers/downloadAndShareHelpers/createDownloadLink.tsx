import { z } from "zod";

import { getParsedData } from "./getParsedData";

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

const getDownloadLink = async ({
  downloadEndpoint,
  meta,
  authFlagEnabled,
  authToken,
}: {
  downloadEndpoint: string;
  meta: {
    downloadSlug: string;
    selection?: string;
    isLegacyDownload?: boolean;
  };
  authFlagEnabled?: boolean;
  authToken?: string | null;
}) => {
  const authHeader = authToken
    ? { Authorization: `Bearer ${authToken}` }
    : undefined;

  const res = await fetch(downloadEndpoint, {
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

  const data = getParsedData(json, schema, "downloads/failed-to-fetch", meta);

  return data.url;
};

export const createLessonDownloadLink = async ({
  lessonSlug,
  isLegacyDownload,
  selection,
  authFlagEnabled,
  authToken,
}: {
  lessonSlug: string;
  isLegacyDownload: boolean;
  selection?: string;
  authFlagEnabled?: boolean;
  authToken?: string | null;
}) => {
  const selectionString = selection ? `?selection=${selection}` : "";
  const downloadEndpoint = `${DOWNLOADS_API_URL}/api/lesson/${lessonSlug}/download${selectionString}`;
  const meta = {
    downloadSlug: lessonSlug,
    selection,
    isLegacyDownload,
  };
  const url = await getDownloadLink({
    downloadEndpoint,
    meta,
    authFlagEnabled,
    authToken,
  });
  return url;
};

export const createUnitDownloadLink = async ({
  unitFileId,
}: {
  unitFileId: string;
}) => {
  const downloadEndpoint = `${DOWNLOADS_API_URL}/api/unit/${unitFileId}/download`;

  const meta = {
    downloadSlug: unitFileId,
  };

  const url = await getDownloadLink({ downloadEndpoint, meta });
  return url;
};
