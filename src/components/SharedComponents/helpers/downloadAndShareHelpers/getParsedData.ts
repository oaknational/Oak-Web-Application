import { ZodType } from "zod";

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

export function getParsedData<T extends ZodType>(
  // eslint-disable-next-line  @typescript-eslint/no-explicit-any
  json: any,
  // eslint-disable-next-line  @typescript-eslint/no-explicit-any
  schema: T,
  oakErrorCode: ErrorInfo["code"],
  meta?: Meta,
) {
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

  if (!parsedJson.data || parsedJson.error) {
    throw new OakError({
      code: oakErrorCode,
      meta: {
        ...meta,
        error: parsedJson.error,
        errorSource: "getParsedData - no data or error",
      },
    });
  }

  return parsedJson.data;
}
