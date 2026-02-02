import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { isBoom } from "@hapi/boom";

import assetHandler from "./asset.handler";

import {
  getGCSHelpers,
  storage,
  AssetSearchParamsSchema,
  parseAssetParams,
  createDownloadsErrorReporter,
  checkDownloadAuthorization,
} from "@/node-lib/curriculum-resources-downloads";
import curriculumApi2023 from "@/node-lib/curriculum-api-2023";

const reportError = createDownloadsErrorReporter("individual-asset");

/**
 * @swagger
 * /api/lesson/{lessonSlug}/asset:
 *   get:
 *     description: Returns a signed URL for a single lesson asset
 *     parameters:
 *       - name: resource
 *         in: query
 *         required: true
 *         description: The resource type to download
 *       - name: assetId
 *         in: query
 *         required: false
 *         description: Required when resource is 'additional-files'
 *     responses:
 *       200:
 *         content: { url: string, filename: string, fileSize: string, contentType: string }
 *         description: Signed URL and metadata for the asset
 *       400:
 *         description: Bad request; invalid resource type or missing assetId
 *       401:
 *         description: Unauthorized; not logged in when required
 *       403:
 *         description: Forbidden; region restricted
 *       404:
 *         description: Not found; lesson or resource not found
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
    const { resource, assetId } = AssetSearchParamsSchema.parse(
      parseAssetParams(searchParams),
    );

    // Fetch lesson assets and additional assets in parallel when needed
    const needsAdditionalAsset = resource === "additional-files" && assetId;

    const [lessonData, additionalAssets] = await Promise.all([
      curriculumApi2023.lessonAssets({ lessonSlug }),
      needsAdditionalAsset
        ? curriculumApi2023.additionalAssets({ assetIds: [Number(assetId)] })
        : Promise.resolve([]),
    ]);

    if (!lessonData) {
      return NextResponse.json(
        { error: { message: "Lesson not found" } },
        { status: 404 },
      );
    }

    const { lesson, isGeoRestricted, isLoginRequired } = lessonData;

    // Authorization checks
    const authResult = await checkDownloadAuthorization(
      isGeoRestricted,
      isLoginRequired,
    );
    if (!authResult.authorized) {
      return authResult.response;
    }

    const additionalAsset = additionalAssets[0] || null;

    const gcsHelpers = getGCSHelpers({ storage });

    const result = await assetHandler(
      { lesson, resource, additionalAsset },
      { gcsHelpers },
    );

    return NextResponse.json({
      data: result,
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

    if (isBoom(error)) {
      reportError(error, {
        severity: "error",
      });
      return NextResponse.json(
        { error: { message: error.message } },
        { status: error.output.statusCode },
      );
    }

    console.error("Unexpected error in asset route:", error);

    reportError(error, {
      severity: "error",
    });

    return NextResponse.json(
      { error: { message: "Internal server error" } },
      { status: 500 },
    );
  }
}
