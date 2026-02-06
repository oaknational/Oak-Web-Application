import { NextResponse } from "next/server";
import { ZodError } from "zod";

import downloadHandler from "./download.handler";

import {
  getGCSHelpers,
  storage,
  getZipHelpers,
  DownloadSearchParamsSchema,
  parseDownloadParams,
  createDownloadsErrorReporter,
  checkDownloadAuthorization,
  isOakError,
  oakErrorToResponse,
} from "@/node-lib/curriculum-resources-downloads";
import curriculumApi2023 from "@/node-lib/curriculum-api-2023";
import getServerConfig from "@/node-lib/getServerConfig";
import OakError from "@/errors/OakError";

const reportError = createDownloadsErrorReporter("lesson-zip-download");

// Allow up to 60 seconds for ZIP generation
export const maxDuration = 60;

/**
 * @swagger
 * /api/lesson/{lessonSlug}/download:
 *   get:
 *     description: Returns a signed URL for downloading selected resources as a ZIP
 *     parameters:
 *       - name: selection
 *         in: query
 *         required: true
 *         description: Comma-separated list of resource types to download
 *       - name: additionalFiles
 *         in: query
 *         required: false
 *         description: Comma-separated list of additional file asset IDs
 *     responses:
 *       200:
 *         content: { url: string }
 *         description: Signed URL for the ZIP download
 *       400:
 *         description: Bad request; malformed request payload/query params
 *       401:
 *         description: Unauthorized; not logged in when required
 *       403:
 *         description: Forbidden; region restricted
 *       404:
 *         description: Not found; lesson or resources not found
 *       500:
 *         description: Server error
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ lessonSlug: string }> },
) {
  try {
    const { lessonSlug } = await params;
    const { searchParams } = new URL(request.url);
    const { selection, additionalFiles } = DownloadSearchParamsSchema.parse(
      parseDownloadParams(searchParams),
    );

    const gcsBucketNameForZips = getServerConfig("gcsBucketNameForZips");
    const gcsDirForLessonZips = getServerConfig("gcsDirForLessonZips");

    // Validate required environment variables
    if (!gcsBucketNameForZips || !gcsDirForLessonZips) {
      console.error("GCS_BUCKET_NAME_FOR_ZIPS is not configured");
      return NextResponse.json(
        { error: { message: "Download service not configured" } },
        { status: 500 },
      );
    }

    const lessonData = await curriculumApi2023.lessonAssets({ lessonSlug });

    if (!lessonData) {
      throw new OakError({
        code: "downloads/lesson-not-found",
        meta: { lessonSlug },
      });
    }

    const { lesson, isGeoRestricted, isLoginRequired } = lessonData;

    const authResult = await checkDownloadAuthorization(
      isGeoRestricted,
      isLoginRequired,
    );
    if (!authResult.authorized) {
      return authResult.response;
    }

    // Fetch additional assets if needed
    const additionalFilesIds =
      additionalFiles?.map((file) => Number(file)) || [];
    const additionalFilesAssets =
      selection.includes("additional-files") && additionalFilesIds.length > 0
        ? await curriculumApi2023.additionalAssets({
            assetIds: additionalFilesIds,
          })
        : [];

    // Add titles from lesson's downloadable files
    const additionalFilesAssetsWithTitles = additionalFilesAssets.map(
      (asset) => {
        const assetTitle = lesson.tpc_downloadablefiles?.find(
          (file) => file.asset_id === asset.asset_id,
        )?.media_object.display_name;

        return {
          ...asset,
          title: assetTitle,
        };
      },
    );

    const gcsHelpers = getGCSHelpers({ storage });
    const zipHelpers = getZipHelpers({ lessonZipsDir: gcsDirForLessonZips });

    const { url } = await downloadHandler(
      {
        lesson,
        selection,
        additionalFilesIds,
        additionalFilesAssets: additionalFilesAssetsWithTitles,
      },
      {
        gcsHelpers,
        zipHelpers,
        gcsBucketNameForZips,
      },
    );

    return NextResponse.json({
      data: { url },
    });
  } catch (error) {
    if (error instanceof ZodError) {
      reportError(error, {
        severity: "error",
      });
      return NextResponse.json(
        {
          error: {
            message: "Validation error",
            validationErrors: error.format(),
          },
        },
        { status: 400 },
      );
    }

    if (isOakError(error)) {
      reportError(error, { severity: "error" });
      return oakErrorToResponse(error);
    }

    console.error("Unexpected error in download route:", error);
    reportError(error, { severity: "error" });

    return NextResponse.json(
      { error: { message: "Internal server error" } },
      { status: 500 },
    );
  }
}
