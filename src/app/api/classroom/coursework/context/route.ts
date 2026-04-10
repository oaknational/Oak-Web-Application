import { NextRequest, NextResponse } from "next/server";

import {
  createClassroomErrorReporter,
  getOakGoogleClassroomAddon,
  isOakGoogleClassroomException,
} from "@/node-lib/google-classroom";

const reportError = createClassroomErrorReporter("coursework-context");

/**
 * Resolves an assignmentToken to the CourseWork entity and, if the pupil is
 * authenticated, fetches their StudentSubmission ID from the Classroom API.
 *
 * GET /api/classroom/coursework/context?assignmentToken=<token>
 *
 * Authenticated (pupil cookies) → returns submissionId in addition to metadata.
 * Unauthenticated → returns metadata only; submissionId will be undefined.
 */
export async function GET(request: NextRequest) {
  try {
    const assignmentToken = request.nextUrl.searchParams.get("assignmentToken");

    if (!assignmentToken) {
      return NextResponse.json(
        { error: "Missing assignmentToken query parameter" },
        { status: 400 },
      );
    }

    const oakClassroomClient = getOakGoogleClassroomAddon(request);

    const courseWork =
      await oakClassroomClient.getClassroomCourseWork(assignmentToken);

    if (!courseWork) {
      return NextResponse.json(
        { error: "Assignment not found" },
        { status: 404 },
      );
    }

    const { courseWorkId, courseId, lessonSlug, programmeSlug, unitSlug } =
      courseWork;

    // If the pupil has authenticated, resolve their submission ID.
    const accessToken = request.headers.get("Authorization");
    const session = request.headers.get("X-Oakgc-Session");

    let submissionId: string | undefined;
    if (accessToken && session) {
      try {
        submissionId = await oakClassroomClient.getStudentSubmissionId(
          courseId,
          courseWorkId,
          accessToken,
          session,
        );
      } catch {
        // Submission lookup failed — caller will treat submissionId as absent.
      }
    }

    return NextResponse.json(
      {
        courseWorkId,
        courseId,
        lessonSlug,
        programmeSlug,
        unitSlug,
        submissionId,
      },
      { status: 200 },
    );
  } catch (error) {
    if (isOakGoogleClassroomException(error)) {
      const errorObject = error.toObject();
      reportError(errorObject);
      return NextResponse.json(errorObject, { status: 400 });
    }

    reportError(error, { severity: "error" });
    return NextResponse.json(
      {
        error: "Failed to resolve coursework context",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}
