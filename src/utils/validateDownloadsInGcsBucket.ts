import errorReporter from "@/common-lib/error-reporter";
import OakError from "@/errors/OakError";
import { getLessonDownloadResourcesExistence } from "@/components/SharedComponents/helpers/downloadAndShareHelpers/getDownloadResourcesExistence";
import { DownloadResourceType } from "@/components/TeacherComponents/types/downloadAndShare.types";

type DownloadItem = {
  exists: boolean | null;
  type: DownloadResourceType;
  [key: string]: unknown;
};

/**
 * Validates which downloads actually exist in the GCS bucket and enriches
 * the downloads array with the `inGcsBucket` property.
 *
 * Assets may have been created by accident - they have a Google Drive URL
 * but don't exist in the bucket. This function checks their availability
 * in the bucket and updates the downloads object accordingly.
 *
 * @param downloads - Array of download items to validate
 * @param lessonSlug - The lesson slug to check downloads for
 * @param errorContext - Context string for error reporting (e.g., function name)
 * @returns Downloads array enriched with `inGcsBucket` property
 */
export async function validateDownloadsInGcsBucket<T extends DownloadItem>(
  downloads: T[],
  lessonSlug: string,
  errorContext: string = "validateDownloadsInGcsBucket",
): Promise<T[]> {
  const reportError = errorReporter(errorContext);

  const resourceTypesToCheck = downloads
    .filter((d) => d.exists === true)
    .map((d) => d.type)
    .join(",");

  if (!resourceTypesToCheck) {
    return downloads;
  }

  try {
    const { resources } = await getLessonDownloadResourcesExistence({
      lessonSlug,
      resourceTypesString: resourceTypesToCheck,
      additionalFilesIdsString: "",
      isLegacyDownload: false,
    });

    const resourcesExistence: {
      item: string;
      exists: boolean;
    }[] = resources.map((r) => {
      const [k, v] = r;
      return {
        item: k,
        exists: v.exists,
      };
    });

    const availableDownloadsSet = new Set(
      resourcesExistence
        .filter((resource) => resource.exists)
        .map((resource) => resource.item),
    );
    return downloads.map((download) => ({
      ...download,
      inGcsBucket: availableDownloadsSet.has(download.type),
    }));
  } catch (e) {
    const oakError = new OakError({
      code: "downloads/failed-to-fetch",
      originalError: e,
    });
    reportError(oakError);
    return downloads;
  }
}
