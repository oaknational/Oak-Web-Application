import { NextRequest, NextResponse } from "next/server";

import {
  getOakGoogleClassroomAddon,
  createClassroomErrorReporter,
} from "@/node-lib/google-classroom";
import { handleClassroomError } from "@/app/api/classroom/classroomUtils";

const reportError = createClassroomErrorReporter("pupil-progress");

export async function GET(request: NextRequest) {
  try {
    const requestUrl = new URL(request.url);
    const submissionId = requestUrl.searchParams.get("submissionId");
    const attachmentId = requestUrl.searchParams.get("attachmentId");
    const itemId = requestUrl.searchParams.get("itemId");
    if (!submissionId || !attachmentId || !itemId) {
      return NextResponse.json(
        { error: "submissionId, attachmentId and itemId required" },
        { status: 400 },
      );
    }

    const oakClassroomClient = getOakGoogleClassroomAddon(request);
    const result = await oakClassroomClient.getPupilLessonProgress(
      submissionId,
      attachmentId,
      itemId,
    );

    return NextResponse.json(result ?? { lessonProgress: null });
  } catch (e) {
    return handleClassroomError(reportError, e);
  }
}
