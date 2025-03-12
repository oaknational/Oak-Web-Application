import { getLessonDownloadResourcesExistence } from "@/components/SharedComponents/helpers/downloadAndShareHelpers/getDownloadResourcesExistence";
import OakError from "@/errors/OakError";

export const getWorksheetInfo = async (lessonSlug: string) => {
  try {
    const { resources: resourceExistence } =
      await getLessonDownloadResourcesExistence({
        lessonSlug,
        resourceTypesString: "worksheet-pdf-questions",
        isLegacyDownload: false,
      });

    const resourcesExistenceAsArray: {
      item: string;
      exists: boolean;
      fileSize: string | undefined;
      ext: string | undefined;
    }[] = resourceExistence.map((r) => {
      const [k, v] = r;
      return {
        item: k,
        exists: v.exists,
        fileSize: v.fileSize,
        ext: v.ext,
      };
    });

    const filteredResourcesExistenceAsArray = resourcesExistenceAsArray
      .map((r) => {
        if (r.exists) return r;
      })
      .filter((resource) => resource !== undefined);
    return filteredResourcesExistenceAsArray;
  } catch (error) {
    const oakError = new OakError({
      code: "downloads/failed-to-fetch",
      originalError: error,
    });
    reportError(oakError);
  }
};
