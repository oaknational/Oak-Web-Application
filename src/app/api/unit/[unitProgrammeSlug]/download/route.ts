import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { isBoom, notFound } from "@hapi/boom";

import {
  getGCSHelpers,
  storage,
  createDownloadsErrorReporter,
} from "@/node-lib/curriculum-resources-downloads";
import curriculumApi2023 from "@/node-lib/curriculum-api-2023";
import { ALLOWED_REGIONS } from "@/utils/onboarding/getRegion";
import getServerConfig from "@/node-lib/getServerConfig";

const reportError = createDownloadsErrorReporter("unit-download");

/**
 * @swagger
 * /api/unit/{unitProgrammeSlug}/download:
 *   get:
 *     description: Returns a signed URL for downloading a pre-built unit ZIP
 *     responses:
 *       200:
 *         content: { url: string }
 *         description: Signed URL for the ZIP download
 *       401:
 *         description: Unauthorized; not logged in
 *       403:
 *         description: Forbidden; region restricted
 *       404:
 *         description: Not found; unit ZIP not found
 *       500:
 *         description: Server error
 */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ unitProgrammeSlug: string }> },
) {
  try {
    const { unitProgrammeSlug } = await params;

    const gcsBucketNameForZips = getServerConfig("gcsBucketNameForZips");
    const gcsDirForUnitZips = getServerConfig("gcsDirForUnitZips");

    if (!gcsBucketNameForZips) {
      console.error("GCS_BUCKET_NAME_FOR_ZIPS is not configured");
      return NextResponse.json(
        { error: { message: "Download service not configured" } },
        { status: 500 },
      );
    }

    if (!gcsDirForUnitZips) {
      console.error("GCS_DIR_FOR_UNIT_ZIPS is not configured");
      return NextResponse.json(
        { error: { message: "Download service not configured" } },
        { status: 500 },
      );
    }

    const gcsHelpers = getGCSHelpers({ storage });

    const zipFilePath = `${gcsDirForUnitZips}/${unitProgrammeSlug}.zip`;

    const exists = await gcsHelpers.checkFileExistsInBucket({
      gcsFilePath: zipFilePath,
      gcsBucketName: gcsBucketNameForZips,
    });

    if (!exists) {
      throw notFound("No file found", { unitProgrammeSlug });
    }

    // unit downloads require login in place of jwt auth can check clerk user
    const user = await currentUser();

    if (!user) {
      return NextResponse.json(
        { error: { message: "Authentication required" } },
        { status: 401 },
      );
    }

    const isGeoRestricted =
      await curriculumApi2023.getIsUnitvariantGeorestrictedQuery({
        unitProgrammeSlug,
      });

    if (isGeoRestricted) {
      const userRegion = user.privateMetadata?.region as string | undefined;
      const isRegionAuthorised =
        userRegion && ALLOWED_REGIONS.includes(userRegion);

      if (!isRegionAuthorised) {
        return NextResponse.json(
          { error: { message: "Access restricted based on your location" } },
          { status: 403 },
        );
      }
    }

    const url = await gcsHelpers.getSignedUrl({
      gcsFilePath: zipFilePath,
      gcsBucketName: gcsBucketNameForZips,
      shouldProxy: true,
    });

    return NextResponse.json({
      data: { url },
    });
  } catch (error) {
    if (isBoom(error)) {
      return NextResponse.json(
        { error: { message: error.message } },
        { status: error.output.statusCode },
      );
    }

    console.error("Unexpected error in unit download route:", error);
    reportError(error, { severity: "error" });

    return NextResponse.json(
      { error: { message: "Internal server error" } },
      { status: 500 },
    );
  }
}
