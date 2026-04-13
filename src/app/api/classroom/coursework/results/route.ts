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

const reportError = createClassroomErrorReporter("coursework-results");

/**
 * GET /api/classroom/coursework/results
 *
 * Fetches the CourseWork entity and pupil progress for a given
 * assignmentToken + submissionId. Requires teacher authentication headers.
 *
 * Used by the /classroom/coursework/results teacher-facing results page
 * that the addon attaches as a link to the student's submission.
 */
export async function GET(request: NextRequest) {
  try {
    const auth = extractAuth(request);
    if (!auth) {
      return unauthorisedResponse();
    }

    const assignmentToken = request.nextUrl.searchParams.get("assignmentToken");
    const submissionId = request.nextUrl.searchParams.get("submissionId");

    if (!assignmentToken || !submissionId) {
      return NextResponse.json(
        { error: "assignmentToken and submissionId are required" },
        { status: 400 },
      );
    }

    const oakClassroomClient = getOakGoogleClassroomAddon(request);

    const [verifiedSession, courseWork, pupilProgress] = await Promise.all([
      oakClassroomClient.verifyAuthSession(auth.session, auth.accessToken),
      oakClassroomClient.getClassroomCourseWork(assignmentToken),
      oakClassroomClient.getCourseWorkPupilProgress(
        submissionId,
        assignmentToken,
      ),
    ]);

    if (!verifiedSession) {
      return unauthorisedResponse();
    }

    if (!courseWork) {
      return NextResponse.json(
        { error: "Assignment not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      lessonSlug: courseWork.lessonSlug,
      programmeSlug: courseWork.programmeSlug,
      unitSlug: courseWork.unitSlug,
      pupilProgress,
    });
  } catch (error) {
    return handleCourseWorkApiError(
      error,
      reportError,
      "Failed to fetch results",
    );
  }
}
