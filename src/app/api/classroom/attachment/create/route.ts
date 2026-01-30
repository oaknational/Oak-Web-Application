import { NextRequest, NextResponse } from "next/server";
import { createAnnouncementAttachmentArgsSchema } from "@oaknational/google-classroom-addon/types";

import { getOakGoogleClassroomAddon } from "@/node-lib/google-classroom";

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

    if (!session)
      return NextResponse.json(
        { message: "Missing auth header" },
        { status: 400 },
      );

    const { lessonSlug } = parsed.data;

    const worksheetDownloadsLink = `http://localhost:3030/api/lesson/${lessonSlug}/asset?resource=worksheet-pdf-questions`;
    const worksheetResponse = await fetch(worksheetDownloadsLink);
    const worksheetData = await worksheetResponse.json();
    const worksheetURL = worksheetData.data.url;

    await oakClassroomClient.createAttachment(
      parsed.data,
      accessToken,
      session,
    );

    // Upload worksheet to user's Google Drive
    const driveClient = await oakClassroomClient.getGoogleDriveClient(
      accessToken,
      session,
    );

    const driveResult = await driveClient.uploadFileFromUrl({
      fileUrl: worksheetURL,
      fileName: `${lessonSlug}-worksheet.pdf`,
      mimeType: "application/pdf",
    });

    return NextResponse.json(
      { driveFileId: driveResult.fileId, webViewLink: driveResult.webViewLink },
      { status: 201 },
    );
  } catch (e) {
    console.error(JSON.stringify(e));
    return NextResponse.json({ error: e }, { status: 500 });
  }
}
