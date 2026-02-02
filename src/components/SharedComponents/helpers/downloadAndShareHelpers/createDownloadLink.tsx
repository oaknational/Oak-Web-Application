import { z } from "zod";

import { getParsedData } from "./getParsedData";

import OakError from "@/errors/OakError";
import getBrowserConfig from "@/browser-lib/getBrowserConfig";
import { GetToken } from "clerk";

const DOWNLOADS_API_URL = getBrowserConfig("downloadApiUrl");

/**
 * Feature flag for using internal OWA download endpoints instead of external downloads-api.
 * When enabled, download requests go to same-origin /api/ routes and use Clerk cookies.
 */
const USE_INTERNAL_DOWNLOADS_API =
  process.env.NEXT_PUBLIC_USE_INTERNAL_DOWNLOADS_API === "true";

// TODO: update config with new env vars and 1pass too

/**
 * Get the base URL for downloads API.
 * Returns empty string for internal API (same-origin) or external URL.
 */
function getDownloadsBaseUrl(): string {
  return USE_INTERNAL_DOWNLOADS_API ? "" : DOWNLOADS_API_URL;
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

const getDownloadLink = async ({
  downloadEndpoint,
  meta,
  authToken,
}: {
  downloadEndpoint: string;
  meta: {
    downloadSlug: string;
    selection?: string;
    isLegacyDownload?: boolean;
  };
  authToken?: string | null;
}) => {
  // For internal API, Clerk cookies are sent automatically (same-origin).
  // For external API, we need to pass the bearer token.
  const authHeader =
    !USE_INTERNAL_DOWNLOADS_API && authToken
      ? { Authorization: `Bearer ${authToken}` }
      : undefined;

  const res = await fetch(downloadEndpoint, {
    headers: {
      ...authHeader,
    },
    // Include credentials for same-origin requests (internal API)
    credentials: USE_INTERNAL_DOWNLOADS_API ? "same-origin" : "omit",
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
  authToken,
}: {
  lessonSlug: string;
  isLegacyDownload: boolean;
  selection?: string;
  additionalFilesIdsSelection?: string;
  authToken?: string | null;
}) => {
  const baseUrl = getDownloadsBaseUrl();
  const selectionString = selection ? `?selection=${selection}` : "";
  const additionalFilesIdsSelectionString = additionalFilesIdsSelection
    ? `&additionalFiles=${additionalFilesIdsSelection}`
    : "";
  const downloadEndpoint = `${baseUrl}/api/lesson/${lessonSlug}/download${selectionString}${additionalFilesIdsSelectionString}`;
  console.log("downloadEndpoint", downloadEndpoint);
  const meta = {
    downloadSlug: lessonSlug,
    selection,
    isLegacyDownload,
  };
  const url = await getDownloadLink({
    downloadEndpoint,
    meta,
    authToken,
  });
  return url;
};

export const createUnitDownloadLink = async ({
  unitFileId,
  getToken,
}: {
  unitFileId: string;
  getToken: GetToken;
}) => {
  const baseUrl = getDownloadsBaseUrl();
  const downloadEndpoint = `${baseUrl}/api/unit/${unitFileId}/download`;

  // For internal API, we don't need a token (Clerk cookies are sent automatically)
  const authToken = USE_INTERNAL_DOWNLOADS_API ? null : await getToken();
  const meta = {
    downloadSlug: unitFileId,
  };

  const url = await getDownloadLink({
    downloadEndpoint,
    meta,
    authToken,
  });
  return url;
};
