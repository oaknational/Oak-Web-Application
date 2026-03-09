import { NextRequest, NextResponse } from "next/server";

import {
  getOakGoogleClassroomAddon,
  isOakGoogleClassroomException,
  createClassroomErrorReporter,
} from "@/node-lib/google-classroom";

const reportError = createClassroomErrorReporter("pupil-progress");

export async function GET(request: NextRequest) {
  try {
    // add requireClassroomAuthHeaders check here
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
    const errorObject = isOakGoogleClassroomException(e) ? e.toObject() : e;
    reportError(errorObject);
    return NextResponse.json(
      { error: e instanceof Error ? e?.message : String(e) },
      { status: 500 },
    );
  }
}
