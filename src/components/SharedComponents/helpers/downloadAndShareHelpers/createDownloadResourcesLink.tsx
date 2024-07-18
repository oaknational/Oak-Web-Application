import { z } from "zod";

import OakError from "@/errors/OakError";

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
  const url = new URL(window.location.href);
  url.pathname = "/api/download/";
  url.searchParams.append("lessonSlug", lessonSlug);
  url.searchParams.append("selection", selection);

  const meta = {
    lessonSlug,
    selection,
    isLegacyDownload,
  };
  const res = await fetch(url.toString());

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
