import { NextRequest, NextResponse } from "next/server";
import { createAnnouncementAttachmentArgsSchema } from "@oaknational/google-classroom-addon/types";

import { getOakGoogleClassroomAddon } from "@/node-lib/google-classroom";
import assetHandler from "@/app/api/lesson/[lessonSlug]/asset/asset.handler";
import curriculumApi2023 from "@/node-lib/curriculum-api-2023";
import {
  getGCSHelpers,
  storage,
} from "@/node-lib/curriculum-resources-downloads";

export async function POST(request: NextRequest) {
  try {
    const accessToken = request.headers.get("Authorization");
    const session = request.headers.get("x-oakgc-session");

    if (!session || !accessToken)
      return NextResponse.json(
        { message: "Authentication required" },
        { status: 401 },
      );

    const oakClassroomClient = getOakGoogleClassroomAddon(request);

    const body = await request.json();

    const parsed = createAnnouncementAttachmentArgsSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid query", details: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const lessonSlug = parsed.data.lessonSlug;

    const lessonData = await curriculumApi2023.lessonAssets({ lessonSlug });

    if (!lessonData) {
      return NextResponse.json({ error: "Lesson not found" }, { status: 404 });
    }

    const gcsHelpers = getGCSHelpers({ storage });

    const lessonAssetData = await assetHandler(
      {
        lesson: lessonData.lesson,
        resource: "worksheet-pdf-questions",
        additionalAsset: null,
      },
      { gcsHelpers },
    );

    const driveClient = await oakClassroomClient.getGoogleDriveClient(
      accessToken,
      session,
    );

    const uploadResult = await driveClient.uploadFileFromUrl({
      fileUrl: lessonAssetData.url,
      fileName: lessonAssetData.filename,
      mimeType: lessonAssetData.contentType,
    });

    await driveClient.shareFile(uploadResult.fileId);

    // Use a redirect URL from our domain (allowlisted) instead of drive.google.com directly
    const protocol = request.headers.get("x-forwarded-proto") || "https";
    const host = request.headers.get("host");
    const baseUrl = `${protocol}://${host}`;
    const redirectUrl = `${baseUrl}/api/classroom/file/${uploadResult.fileId}`;

    await oakClassroomClient.createDriveFileAttachment(
      {
        courseId: parsed.data.courseId,
        itemId: parsed.data.itemId,
        addOnToken: parsed.data.addOnToken,
        title: lessonAssetData.filename,
        webViewLink: redirectUrl,
      },
      accessToken,
      session,
    );

    await oakClassroomClient.createAttachment(
      parsed.data,
      accessToken,
      session,
    );

    return NextResponse.json(
      { fileId: uploadResult.fileId, webViewLink: uploadResult.webViewLink },
      { status: 201 },
    );
  } catch (e) {
    console.log(e, "<<< error");
    console.error(JSON.stringify(e));
    return NextResponse.json({ error: e }, { status: 500 });
  }
}
