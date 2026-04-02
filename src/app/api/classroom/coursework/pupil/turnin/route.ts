import { NextRequest, NextResponse } from "next/server";
import z from "zod";

import {
  createClassroomErrorReporter,
  getOakGoogleClassroomAddon,
  isOakGoogleClassroomException,
} from "@/node-lib/google-classroom";

const reportError = createClassroomErrorReporter("coursework-pupil-turnin");

const turnInBodySchema = z.object({
  courseId: z.string(),
  courseWorkId: z.string(),
  submissionId: z.string(),
  assignmentToken: z.string(),
});

export async function POST(request: NextRequest) {
  try {
    const accessToken = request.headers.get("Authorization");
    const session = request.headers.get("x-oakgc-session");

    if (!session || !accessToken) {
      return NextResponse.json(
        { message: "Authentication required" },
        { status: 401 },
      );
    }

    const body = await request.json();
    const parsed = turnInBodySchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid request body", details: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const oakClassroomClient = getOakGoogleClassroomAddon(request);
    await oakClassroomClient.turnInCourseWorkSubmission(
      parsed.data.courseId,
      parsed.data.courseWorkId,
      parsed.data.submissionId,
      parsed.data.assignmentToken,
      accessToken,
      session,
    );

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (e) {
    const errorObject = isOakGoogleClassroomException(e) ? e.toObject() : e;
    reportError(errorObject);
    return NextResponse.json(
      { error: e instanceof Error ? e.message : String(e) },
      { status: 500 },
    );
  }
}
