import { NextRequest, NextResponse } from "next/server";
import { postSubmissionStateSchema } from "@oaknational/google-classroom-addon/dist/types";

import {
  createClassroomErrorReporter,
  getOakGoogleClassroomAddon,
  isOakGoogleClassroomException,
} from "@/node-lib/google-classroom";

const reportError = createClassroomErrorReporter("submission-state");

export async function GET(request: NextRequest) {
  try {
    const requestUrl = new URL(request.url);
    const submissionId = requestUrl.searchParams.get("submissionId");
    const attachmentId = requestUrl.searchParams.get("attachmentId");
    const itemId = requestUrl.searchParams.get("itemId");
    const courseId = requestUrl.searchParams.get("courseId");
    if (!submissionId || !attachmentId || !itemId || !courseId) {
      return NextResponse.json(
        { error: "submissionId, attachmentId, itemId and courseId required" },
        { status: 400 },
      );
    }
    const accessToken = request.headers.get("Authorization");
    const session = request.headers.get("x-oakgc-session");

    if (!session || !accessToken) {
      return NextResponse.json(
        { message: "Authentication required" },
        { status: 401 },
      );
    }

    const oakClassroomClient = getOakGoogleClassroomAddon(request);

    const submissionState = await oakClassroomClient.getPostSubmissionState(
      {
        courseId,
        itemId,
        attachmentId,
        submissionId,
      },
      accessToken,
      session,
    );

    const parsedState = postSubmissionStateSchema.safeParse(submissionState);

    return NextResponse.json({ parsedState }, { status: 200 });
  } catch (e) {
    const errorObject = isOakGoogleClassroomException(e) ? e.toObject() : e;
    reportError(errorObject);

    return NextResponse.json(
      { error: e instanceof Error ? e.message : String(e) },
      { status: 500 },
    );
  }
}
