import { z } from "zod";

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

type Meta =
  | {
      lessonSlug: string;
      resourceTypesString: string;
      isLegacyDownload: boolean;
    }
  | { unitProgrammeSlug: string };

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

export const getLessonDownloadResourcesExistence = async (
  lessonSlug: string,
  resourceTypesString: string,
  isLegacyDownload: boolean,
) => {
  const checkWhichResourcesExistEndpoint = `${DOWNLOADS_API_URL}/api/lesson/${lessonSlug}/check-files?selection=${resourceTypesString}`;

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

export const getUnitDownloadFileExistence = async (
  unitProgrammeSlug: string,
) => {
  const checkWhichResourcesExistEndpoint = `${DOWNLOADS_API_URL}/api/unit/${unitProgrammeSlug}/check-files`;

  const meta = {
    unitProgrammeSlug,
  };

  const res = await getDownloadExistence(
    meta,
    checkWhichResourcesExistEndpoint,
  );
  return unitDataSchema.parse(res);
};
