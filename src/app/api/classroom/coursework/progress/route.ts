import { NextRequest, NextResponse } from "next/server";
import { upsertCourseWorkPupilProgressArgsSchema } from "@oaknational/google-classroom-addon/types";

import {
  createClassroomErrorReporter,
  getOakGoogleClassroomAddon,
} from "@/node-lib/google-classroom";
import {
  extractAuth,
  handleCourseWorkApiError,
  unauthorisedResponse,
} from "@/app/api/classroom/coursework/courseWorkApiHelpers";

const reportError = createClassroomErrorReporter("coursework-progress");

/**
 * GET /api/classroom/coursework/progress?submissionId=<id>&assignmentToken=<token>
 *
 * Retrieves saved pupil progress for a CourseWork assignment.
 * Requires pupil authentication headers. Verifies the authenticated pupil
 * owns the requested submission before returning data.
 */
export async function GET(request: NextRequest) {
  try {
    const auth = extractAuth(request);
    if (!auth) {
      return unauthorisedResponse();
    }

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
    const [verifiedSession, progress] = await Promise.all([
      oakClassroomClient.verifyAuthSession(auth.session, auth.accessToken),
      oakClassroomClient.getCourseWorkPupilProgress(
        submissionId,
        assignmentToken,
      ),
    ]);

    if (!verifiedSession) {
      return unauthorisedResponse();
    }

    if (
      progress &&
      verifiedSession.loginHint &&
      verifiedSession.loginHint !== progress.pupilLoginHint
    ) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    return NextResponse.json(progress, { status: 200 });
  } catch (error) {
    return handleCourseWorkApiError(
      error,
      reportError,
      "Failed to retrieve progress",
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
    const auth = extractAuth(request);

    if (!auth) {
      return unauthorisedResponse();
    }

    const body = await request.json();
    const parsed = upsertCourseWorkPupilProgressArgsSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid request body", details: parsed.error.issues },
        { status: 400 },
      );
    }

    const oakClassroomClient = getOakGoogleClassroomAddon(request);
    const result = await oakClassroomClient.upsertCourseWorkPupilProgress(
      parsed.data,
      auth.accessToken,
      auth.session,
    );

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    return handleCourseWorkApiError(
      error,
      reportError,
      "Failed to upsert progress",
    );
  }
}
