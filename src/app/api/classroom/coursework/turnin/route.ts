import { NextRequest, NextResponse } from "next/server";
import z from "zod";

import {
  createClassroomErrorReporter,
  getOakGoogleClassroomAddon,
  isOakGoogleClassroomException,
} from "@/node-lib/google-classroom";

const reportError = createClassroomErrorReporter("coursework-turnin");

const turnInBodySchema = z.object({
  assignmentToken: z.string(),
});

/**
 * POST /api/classroom/coursework/turnin
 *
 * Turns in the authenticated pupil's CourseWork submission.
 * Uses the assignmentToken to look up courseWorkId + courseId from Firestore,
 * then fetches the pupil's submissionId from the Classroom API, and turns in.
 * Requires pupil authentication headers.
 */
export async function POST(request: NextRequest) {
  try {
    const accessToken = request.headers.get("Authorization");
    const session = request.headers.get("X-Oakgc-Session");

    if (!accessToken || !session) {
      return NextResponse.json(
        { message: "Authentication required" },
        { status: 401 },
      );
    }

    const body = await request.json();
    const parsed = turnInBodySchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid request body", details: parsed.error.issues },
        { status: 400 },
      );
    }

    const { assignmentToken } = parsed.data;
    const oakClassroomClient = getOakGoogleClassroomAddon(request);

    const courseWork =
      await oakClassroomClient.getClassroomCourseWork(assignmentToken);

    if (!courseWork) {
      return NextResponse.json(
        { error: "Assignment not found" },
        { status: 404 },
      );
    }

    const { courseWorkId, courseId } = courseWork;

    const submissionId = await oakClassroomClient.getStudentSubmissionId(
      courseId,
      courseWorkId,
      accessToken,
      session,
    );

    await oakClassroomClient.turnInCourseWorkSubmission(
      courseId,
      courseWorkId,
      submissionId,
      assignmentToken,
      accessToken,
      session,
    );

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    if (isOakGoogleClassroomException(error)) {
      const errorObject = error.toObject();
      reportError(errorObject);
      return NextResponse.json(errorObject, { status: 400 });
    }

    reportError(error, { severity: "error" });
    return NextResponse.json(
      {
        error: "Failed to turn in assignment",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}
