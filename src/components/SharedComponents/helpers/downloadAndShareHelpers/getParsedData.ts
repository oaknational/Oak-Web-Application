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

export const getParsedData = <T extends { data?: unknown; error?: unknown }>(
  json: unknown,
  schema: z.ZodType<T>,
  oakErrorCode: ErrorInfo["code"],
  meta?: Meta,
): NonNullable<T["data"]> => {
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

  const result = parsedJson.data as T;
  const { data, error } = result;

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

  return data as NonNullable<T["data"]>;
};
