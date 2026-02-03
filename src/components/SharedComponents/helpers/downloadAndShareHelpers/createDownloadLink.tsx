import { z } from "zod";

import { getParsedData } from "./getParsedData";

import OakError from "@/errors/OakError";
import { GetToken } from "clerk";

// TODO: update config with new env vars and 1pass too

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
}: {
  downloadEndpoint: string;
  meta: {
    downloadSlug: string;
    selection?: string;
    isLegacyDownload?: boolean;
  };
}) => {
  console.log(downloadEndpoint, "DOWNLOAD ENDPOINT LINK");

  const res = await fetch(downloadEndpoint);

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
}: {
  lessonSlug: string;
  isLegacyDownload: boolean;
  selection?: string;
  additionalFilesIdsSelection?: string;
}) => {
  const selectionString = selection ? `?selection=${selection}` : "";
  const additionalFilesIdsSelectionString = additionalFilesIdsSelection
    ? `&additionalFiles=${additionalFilesIdsSelection}`
    : "";
  const downloadEndpoint = `/api/lesson/${lessonSlug}/download${selectionString}${additionalFilesIdsSelectionString}`;
  console.log("DOWNLOAD ENDPOINT ACA", downloadEndpoint);
  const meta = {
    downloadSlug: lessonSlug,
    selection,
    isLegacyDownload,
  };
  const url = await getDownloadLink({
    downloadEndpoint,
    meta,
  });
  return url;
};

export const createUnitDownloadLink = async ({
  unitFileId,
}: {
  unitFileId: string;
  getToken: GetToken;
}) => {
  const downloadEndpoint = `/api/unit/${unitFileId}/download`;
  console.log("DOWNLOAD ENDPOINT", downloadEndpoint);

  const meta = {
    downloadSlug: unitFileId,
  };

  const url = await getDownloadLink({
    downloadEndpoint,
    meta,
  });
  return url;
};
