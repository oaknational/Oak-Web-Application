import { z } from "zod";

import OakError, { ErrorInfo } from "@/errors/OakError";

export type Meta =
  | {
      lessonSlug: string;
      resourceTypesString: string;
      isLegacyDownload: boolean;
    }
  | { unitProgrammeSlug: string }
  | {
      downloadSlug: string;
      selection?: string;
      isLegacyDownload?: boolean;
    };

export const getParsedData = (
  // eslint-disable-next-line  @typescript-eslint/no-explicit-any
  json: any,
  // eslint-disable-next-line  @typescript-eslint/no-explicit-any
  schema: z.AnyZodObject,
  oakErrorCode: ErrorInfo["code"],
  meta?: Meta,
) => {
  const parsedJson = schema.safeParse(json);

  if (!parsedJson.success) {
    throw new OakError({
      code: "downloads/check-files-failed",
      originalError: parsedJson.error,
      meta: {
        ...MediaMetadata,
        type: "zod error",
        error: parsedJson.error.message,
        errorSource: "getParsedData - parsedJson failed",
      },
    });
  }

  const { data, error } = parsedJson.data;

  if (!data || error) {
    throw new OakError({
      code: oakErrorCode,
      meta: {
        ...meta,
        error,
        errorSource: "getParsedData - no data or error",
      },
    });
  }

  return data;
};
