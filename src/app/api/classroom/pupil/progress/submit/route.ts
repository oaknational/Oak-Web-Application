import { NextRequest, NextResponse } from "next/server";
import { upsertPupilLessonProgressArgsSchema } from "@oaknational/google-classroom-addon/types";

import {
  createClassroomErrorReporter,
  getOakGoogleClassroomAddon,
  isOakGoogleClassroomException,
} from "@/node-lib/google-classroom";
import {
  handleClassroomError,
  requireClassroomAuthHeaders,
} from "@/app/api/classroom/classroomUtils";

const reportError = createClassroomErrorReporter("submit-pupil-progress");

export async function POST(request: NextRequest) {
  try {
    const auth = requireClassroomAuthHeaders(request);
    if (auth instanceof NextResponse) return auth;
    const { accessToken, session } = auth;

    const oakClassroomClient = getOakGoogleClassroomAddon(request);
    const body = await request.json();
    const parsed = upsertPupilLessonProgressArgsSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid request body", details: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const result = await oakClassroomClient.upsertPupilLessonProgress(
      parsed.data,
      accessToken,
      session,
    );

    return NextResponse.json(result, { status: 200 });
  } catch (e) {
    if (isOakGoogleClassroomException(e)) {
      const errorObject = e.toObject();
      reportError(errorObject);
      return NextResponse.json(errorObject, { status: 403 });
    }
    return handleClassroomError(reportError, e);
  }
}
