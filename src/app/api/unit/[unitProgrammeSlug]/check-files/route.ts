import { NextResponse } from "next/server";

import {
  getGCSHelpers,
  storage,
  createDownloadsErrorReporter,
  isOakError,
  oakErrorToResponse,
} from "@/node-lib/curriculum-resources-downloads";
import getServerConfig from "@/node-lib/getServerConfig";

const reportError = createDownloadsErrorReporter("unit-check-files");

/**
 * @swagger
 * /api/unit/{unitProgrammeSlug}/check-files:
 *   get:
 *     description: Returns file existence and file size for a unit ZIP
 *     responses:
 *       200:
 *         description: File existence (boolean) and file size (string or undefined)
 *       400:
 *         description: Bad request; malformed request payload/query params
 *       500:
 *         description: Server error
 */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ unitProgrammeSlug: string }> },
) {
  try {
    const { unitProgrammeSlug } = await params;
    console.log("unitProgrammeSlug OWA API", unitProgrammeSlug);
    const gcsBucketNameForZips = getServerConfig("gcsBucketNameForZips");
    const gcsDirForUnitZips = getServerConfig("gcsDirForUnitZips");

    // validate env vars - TODO: move to a utils file?
    if (!gcsBucketNameForZips || !gcsDirForUnitZips) {
      console.error("GCS_BUCKET_NAME_FOR_ZIPS is not configured");
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

    const fileSize = exists
      ? await gcsHelpers.getFileSize({
          gcsFilePath: zipFilePath,
          gcsBucketName: gcsBucketNameForZips,
        })
      : undefined;

    return NextResponse.json({
      data: { exists, fileSize },
    });
  } catch (error) {
    if (isOakError(error)) {
      reportError(error, { severity: "error" });
      return oakErrorToResponse(error);
    }

    console.error("Unexpected error in unit check-files route:", error);
    reportError(error, { severity: "error" });

    return NextResponse.json(
      { error: { message: "Internal server error" } },
      { status: 500 },
    );
  }
}
