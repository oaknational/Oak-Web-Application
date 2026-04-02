import { NextRequest, NextResponse } from "next/server";
import { upsertCourseWorkPupilProgressArgsSchema } from "@oaknational/google-classroom-addon/types";

import {
  createClassroomErrorReporter,
  getOakGoogleClassroomAddon,
  isOakGoogleClassroomException,
} from "@/node-lib/google-classroom";

const reportError = createClassroomErrorReporter("coursework-pupil-progress");

export async function GET(request: NextRequest) {
  try {
    const requestUrl = new URL(request.url);
    const submissionId = requestUrl.searchParams.get("submissionId");

    if (!submissionId) {
      return NextResponse.json(
        { error: "submissionId query parameter is required" },
        { status: 400 },
      );
    }

    const oakClassroomClient = getOakGoogleClassroomAddon(request);
    const result =
      await oakClassroomClient.getCourseWorkPupilProgress(submissionId);

    return NextResponse.json(result ?? { progress: null }, { status: 200 });
  } catch (e) {
    const errorObject = isOakGoogleClassroomException(e) ? e.toObject() : e;
    reportError(errorObject);
    return NextResponse.json(
      { error: e instanceof Error ? e.message : String(e) },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const accessToken = request.headers.get("Authorization");
    const session = request.headers.get("x-oakgc-session");

    if (!session || !accessToken) {
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
  } catch (e) {
    if (isOakGoogleClassroomException(e)) {
      const errorObject = e.toObject();
      reportError(errorObject);
      return NextResponse.json(errorObject, { status: 403 });
    }
    reportError(e);
    return NextResponse.json(
      { error: e instanceof Error ? e.message : String(e) },
      { status: 500 },
    );
  }
}
