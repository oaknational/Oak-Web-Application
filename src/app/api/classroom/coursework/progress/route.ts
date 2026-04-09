import { NextRequest, NextResponse } from "next/server";
import { upsertCourseWorkPupilProgressArgsSchema } from "@oaknational/google-classroom-addon/types";

import {
  createClassroomErrorReporter,
  getOakGoogleClassroomAddon,
  isOakGoogleClassroomException,
} from "@/node-lib/google-classroom";

const reportError = createClassroomErrorReporter("coursework-progress");

/**
 * GET /api/classroom/coursework/progress?submissionId=<id>&assignmentToken=<token>
 *
 * Retrieves saved pupil progress for a CourseWork assignment.
 * Does not require Google Classroom authentication (Firestore-only lookup).
 */
export async function GET(request: NextRequest) {
  try {
    const submissionId = request.nextUrl.searchParams.get("submissionId");
    const assignmentToken = request.nextUrl.searchParams.get("assignmentToken");

    if (!submissionId || !assignmentToken) {
      return NextResponse.json(
        {
          error:
            "Missing required query parameters: submissionId, assignmentToken",
        },
        { status: 400 },
      );
    }

    const oakClassroomClient = getOakGoogleClassroomAddon(request);
    const progress = await oakClassroomClient.getCourseWorkPupilProgress(
      submissionId,
      assignmentToken,
    );

    return NextResponse.json(progress, { status: 200 });
  } catch (error) {
    if (isOakGoogleClassroomException(error)) {
      const errorObject = error.toObject();
      reportError(errorObject);
      return NextResponse.json(errorObject, { status: 400 });
    }

    reportError(error, { severity: "error" });
    return NextResponse.json(
      {
        error: "Failed to retrieve progress",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}

/**
 * POST /api/classroom/coursework/progress
 *
 * Upserts pupil progress for a CourseWork assignment and syncs a grade to
 * Google Classroom when the exit quiz is newly completed.
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
    const parsed = upsertCourseWorkPupilProgressArgsSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid request body", details: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const oakClassroomClient = getOakGoogleClassroomAddon(request);
    const result = await oakClassroomClient.upsertCourseWorkPupilProgress(
      parsed.data,
      accessToken,
      session,
    );

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    if (isOakGoogleClassroomException(error)) {
      const errorObject = error.toObject();
      reportError(errorObject);
      return NextResponse.json(errorObject, { status: 400 });
    }

    reportError(error, { severity: "error" });
    return NextResponse.json(
      {
        error: "Failed to upsert progress",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}
