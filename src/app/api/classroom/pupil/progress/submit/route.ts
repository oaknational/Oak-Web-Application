import { NextRequest, NextResponse } from "next/server";
import { upsertPupilLessonProgressArgsSchema } from "@oaknational/google-classroom-addon/types";

import {
  createClassroomErrorReporter,
  getClassroomAuthFromRequest,
  getOakGoogleClassroomAddon,
  isOakGoogleClassroomException,
} from "@/node-lib/google-classroom";

const reportError = createClassroomErrorReporter("submit-pupil-progress");

export async function POST(request: NextRequest) {
  try {
    const auth = getClassroomAuthFromRequest(request, "pupil");
    const accessToken = auth?.accessToken;
    const session = auth?.session;

    if (!session || !accessToken)
      return NextResponse.json(
        { message: "Authentication required" },
        { status: 401 },
      );

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
    // Check if it's an OakGoogleClassroomException with submission state error
    if (isOakGoogleClassroomException(e)) {
      const errorObject = e.toObject();
      reportError(errorObject);
      return NextResponse.json(errorObject, { status: 403 });
    }
    reportError(e);
    return NextResponse.json(
      { error: e instanceof Error ? e?.message : String(e) },
      { status: 500 },
    );
  }
}
