import { NextResponse } from "next/server";
import { ZodError } from "zod";

import checkFilesHandler from "./check-files.handler";

import {
  getGCSHelpers,
  storage,
  DownloadSearchParamsSchema,
  parseDownloadParams,
  createDownloadsErrorReporter,
  checkDownloadAuthorization,
  isOakError,
  oakErrorToResponse,
} from "@/node-lib/curriculum-resources-downloads";
import curriculumApi2023 from "@/node-lib/curriculum-api-2023";

const reportError = createDownloadsErrorReporter("check-files");

/**
 * @swagger
 * /api/lesson/{lessonSlug}/check-files:
 *   get:
 *     description: Returns file existence results for selected resources
 *     parameters:
 *       - name: selection
 *         in: query
 *         required: true
 *         description: Comma-separated list of resource types to check
 *       - name: additionalFiles
 *         in: query
 *         required: false
 *         description: Comma-separated list of additional file asset IDs
 *     responses:
 *       200:
 *         description: File existence results
 *       400:
 *         description: Bad request; malformed request payload/query params
 *       401:
 *         description: Unauthorized; not logged in when required
 *       403:
 *         description: Forbidden; region restricted
 *       404:
 *         description: Not found; lesson not found
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

    const lessonData = await curriculumApi2023.lessonAssets({ lessonSlug });

    if (!lessonData) {
      return NextResponse.json(
        { error: { message: "Lesson not found" } },
        { status: 404 },
      );
    }

    const { lesson, isGeoRestricted, isLoginRequired } = lessonData;

    const authResult = await checkDownloadAuthorization(
      isGeoRestricted,
      isLoginRequired,
    );
    if (!authResult.authorized) {
      return authResult.response;
    }

    const additionalFilesIds =
      additionalFiles?.map((file) => Number(file)) || [];
    const additionalFilesAssets =
      selection.includes("additional-files") && additionalFilesIds.length > 0
        ? await curriculumApi2023.additionalAssets({
            assetIds: additionalFilesIds,
          })
        : [];

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

    const resources = await checkFilesHandler(
      {
        lesson,
        selection,
        additionalFiles,
        additionalFilesAssets: additionalFilesAssetsWithTitles,
      },
      { gcsHelpers },
    );

    return NextResponse.json({
      data: { resources },
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

    console.error("Unexpected error in check-files route:", error);
    reportError(error, { severity: "error" });

    return NextResponse.json(
      { error: { message: "Internal server error" } },
      { status: 500 },
    );
  }
}
