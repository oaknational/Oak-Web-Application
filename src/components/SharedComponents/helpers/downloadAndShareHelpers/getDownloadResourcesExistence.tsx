import { z } from "zod";

import { Meta, getParsedData } from "./getParsedData";

import { DownloadResourceType } from "@/components/TeacherComponents/types/downloadAndShare.types";
import OakError from "@/errors/OakError";
import getBrowserConfig from "@/browser-lib/getBrowserConfig";

const DOWNLOADS_API_URL = getBrowserConfig("downloadApiUrl");

/**
 * Expected response schema
 */
const lessonDataSchema = z.object({
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
        fileSize: z.string().optional(),
        ext: z.string().optional(),
      }),
    ]),
  ),
});
const unitDataSchema = z.object({
  exists: z.boolean(),
  fileSize: z.string().optional(),
});

const schema = z.object({
  data: lessonDataSchema.or(unitDataSchema),
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

const getDownloadExistence = async (
  meta: Meta,
  checkWhichResourcesExistEndpoint: string,
) => {
  const res = await fetch(checkWhichResourcesExistEndpoint);

  if (!res.ok) {
    throw new OakError({
      code: "downloads/check-files-failed",
      meta,
    });
  }

  const json = await res.json();

  const data = getParsedData(
    json,
    schema,
    "downloads/check-files-failed",
    meta,
  );

  return data;
};

export const getLessonDownloadResourcesExistence = async ({
  lessonSlug,
  resourceTypesString,
  additionalFilesIdsString,
  isLegacyDownload,
}: {
  lessonSlug: string;
  resourceTypesString: string;
  additionalFilesIdsString?: string;
  isLegacyDownload: boolean;
}) => {
  const checkWhichResourcesExistEndpoint = additionalFilesIdsString
    ? `${DOWNLOADS_API_URL}/api/lesson/${lessonSlug}/check-files?selection=${resourceTypesString}`
    : `${DOWNLOADS_API_URL}/api/lesson/${lessonSlug}/check-files?selection=${resourceTypesString}&additionalFiles=${additionalFilesIdsString}`;

  const meta = {
    lessonSlug,
    resourceTypesString,
    isLegacyDownload,
  };

  const res = await getDownloadExistence(
    meta,
    checkWhichResourcesExistEndpoint,
  );
  return lessonDataSchema.parse(res);
};

export const getUnitDownloadFileExistence = async (unitFileId: string) => {
  const checkWhichResourcesExistEndpoint = `${DOWNLOADS_API_URL}/api/unit/${unitFileId}/check-files`;

  const meta = {
    unitProgrammeSlug: unitFileId,
  };

  const res = await getDownloadExistence(
    meta,
    checkWhichResourcesExistEndpoint,
  );
  return unitDataSchema.parse(res);
};
