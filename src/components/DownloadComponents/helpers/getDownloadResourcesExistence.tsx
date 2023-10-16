import { z } from "zod";

import { DownloadResourceType } from "../downloads.types";

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
          z.custom<DownloadResourceType>(),
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

const legacySchema = z.object({
  data: z
    .object({
      resources: z.object({
        "exit-quiz-answers": z.boolean().optional(),
        "exit-quiz-questions": z.boolean().optional(),
        "intro-quiz-answers": z.boolean().optional(),
        "intro-quiz-questions": z.boolean().optional(),
        presentation: z.boolean().optional(),
        "worksheet-pdf": z.boolean().optional(),
        "worksheet-pptx": z.boolean().optional(),
      }),
    })
    .optional(),
  error: z
    .object({
      message: z.string(),
    })
    .optional(),
});
export type DownloadsApiCheckFilesResponseSchema = z.infer<typeof schema>;
export type LegacyDownloadsApiCheckFilesResponseSchema = z.infer<
  typeof legacySchema
>;

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

  console.log(
    "checkWhichResourcesExistEndpoint",
    checkWhichResourcesExistEndpoint,
  );
  const res = await fetch(checkWhichResourcesExistEndpoint);

  if (!res.ok) {
    throw new OakError({
      code: "downloads/check-files-failed",
      meta,
    });
  }

  const json = await res.json();

  const transformLegacyDownloadResponse = (
    json: LegacyDownloadsApiCheckFilesResponseSchema,
  ) => {
    const transformedJson = json.data && {
      data: {
        resources: Object.entries(json.data.resources).map(([k, v]) => {
          return [k, { exists: v, errors: [] }];
        }),
      },
      error: json.error,
    };
    return transformedJson;
  };

  const parsedJson = isLegacyDownload
    ? schema.safeParse(transformLegacyDownloadResponse(json))
    : schema.safeParse(json);

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
