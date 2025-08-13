import { z } from "zod";

import { getParsedData } from "./getParsedData";

import OakError from "@/errors/OakError";
import getBrowserConfig from "@/browser-lib/getBrowserConfig";
import { GetToken } from "clerk";

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
  authRequired,
  authToken,
}: {
  downloadEndpoint: string;
  meta: {
    downloadSlug: string;
    selection?: string;
    isLegacyDownload?: boolean;
  };
  authRequired?: boolean;
  authToken?: string | null;
}) => {
  const authHeader = authToken
    ? { Authorization: `Bearer ${authToken}` }
    : undefined;

  const res = await fetch(downloadEndpoint, {
    headers: {
      ...authHeader,
      "X-Should-Authenticate-Download": JSON.stringify(Boolean(authRequired)),
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
  additionalFilesIdsSelection,
  authRequired,
  authToken,
}: {
  lessonSlug: string;
  isLegacyDownload: boolean;
  selection?: string;
  additionalFilesIdsSelection?: string;
  authRequired?: boolean;
  authToken?: string | null;
}) => {
  const selectionString = selection ? `?selection=${selection}` : "";
  const additionalFilesIdsSelectionString = additionalFilesIdsSelection
    ? `&additionalFiles=${additionalFilesIdsSelection}`
    : "";
  const downloadEndpoint = `${DOWNLOADS_API_URL}/api/lesson/${lessonSlug}/download${selectionString}${additionalFilesIdsSelectionString}`;
  const meta = {
    downloadSlug: lessonSlug,
    selection,
    isLegacyDownload,
  };
  const url = await getDownloadLink({
    downloadEndpoint,
    meta,
    authRequired,
    authToken,
  });
  return url;
};

export const createUnitDownloadLink = async ({
  unitFileId,
  authRequired,
  getToken,
}: {
  unitFileId: string;
  authRequired?: boolean;
  getToken: GetToken;
}) => {
  const downloadEndpoint = `${DOWNLOADS_API_URL}/api/unit/${unitFileId}/download`;
  const authToken = await getToken();
  const meta = {
    downloadSlug: unitFileId,
  };

  const url = await getDownloadLink({
    downloadEndpoint,
    meta,
    authRequired,
    authToken,
  });
  return url;
};
