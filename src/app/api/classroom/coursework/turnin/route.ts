import { NextRequest, NextResponse } from "next/server";

import {
  createClassroomErrorReporter,
  getOakGoogleClassroomAddon,
  turnInBodySchema,
} from "@/node-lib/google-classroom";
import {
  extractPupilAuth,
  handleCourseWorkApiError,
  unauthorizedResponse,
} from "@/app/api/classroom/coursework/courseWorkApiHelpers";

const reportError = createClassroomErrorReporter("coursework-turnin");

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
    const auth = extractPupilAuth(request);

    if (!auth) {
      return unauthorizedResponse();
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
      auth.accessToken,
      auth.session,
    );

    await oakClassroomClient.turnInCourseWorkSubmission(
      courseId,
      courseWorkId,
      submissionId,
      assignmentToken,
      auth.accessToken,
      auth.session,
    );

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    return handleCourseWorkApiError(
      error,
      reportError,
      "Failed to turn in assignment",
    );
  }
}
