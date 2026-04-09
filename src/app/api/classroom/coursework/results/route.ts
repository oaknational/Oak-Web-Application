import { NextRequest, NextResponse } from "next/server";

import {
  createClassroomErrorReporter,
  getOakGoogleClassroomAddon,
} from "@/node-lib/google-classroom";

const reportError = createClassroomErrorReporter("coursework-results");

/**
 * GET /api/classroom/coursework/results
 *
 * Fetches the CourseWork entity and pupil progress for a given
 * assignmentToken + submissionId. No authentication required —
 * both lookups are Firestore-only.
 *
 * Used by the /classroom/coursework/results teacher-facing results page
 * that the addon attaches as a link to the student's submission.
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const assignmentToken = searchParams.get("assignmentToken");
    const submissionId = searchParams.get("submissionId");

    if (!assignmentToken || !submissionId) {
      return NextResponse.json(
        { error: "assignmentToken and submissionId are required" },
        { status: 400 },
      );
    }

    const oakClassroomClient = getOakGoogleClassroomAddon(request);

    const [courseWork, pupilProgress] = await Promise.all([
      oakClassroomClient.getClassroomCourseWork(assignmentToken),
      oakClassroomClient.getCourseWorkPupilProgress(
        submissionId,
        assignmentToken,
      ),
    ]);

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
    reportError(error, { severity: "error" });
    return NextResponse.json(
      {
        error: "Failed to fetch results",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}
