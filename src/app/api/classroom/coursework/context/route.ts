import { NextRequest, NextResponse } from "next/server";

import {
  createClassroomErrorReporter,
  getOakGoogleClassroomAddon,
} from "@/node-lib/google-classroom";
import {
  extractAuth,
  handleCourseWorkApiError,
  unauthorisedResponse,
} from "@/app/api/classroom/coursework/courseWorkApiHelpers";

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
    const auth = extractAuth(request);

    if (!auth) {
      return unauthorisedResponse();
    }

    const { accessToken, session } = auth;

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
        console.error(
          "Failed to fetch student submission ID; returning context without it",
        );
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
    return handleCourseWorkApiError(
      error,
      reportError,
      "Failed to resolve coursework context",
    );
  }
}
