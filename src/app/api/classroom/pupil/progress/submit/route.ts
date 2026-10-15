import { NextRequest, NextResponse } from "next/server";
import {
  PostSubmissionState,
  pupilLessonProgressSchema,
  upsertPupilLessonProgressArgsSchema,
} from "@oaknational/google-classroom-addon/types";

import type { SubmitPupilProgressResult } from "@/browser-lib/google-classroom/googleClassroomApi";
import {
  createClassroomErrorReporter,
  getOakGoogleClassroomAddon,
  isOakGoogleClassroomException,
} from "@/node-lib/google-classroom";

const reportError = createClassroomErrorReporter("submit-pupil-progress");

const hasAuthHeaders = (request: NextRequest) => {
  const accessToken = request.headers.get("Authorization");
  const session = request.headers.get("x-oakgc-session");
  return { accessToken, session };
};

const writeStatuses = ["PERSISTED", "READ_ONLY", "GRADE_SUBMITTED"] as const;

const normaliseWriteResult = (result: unknown): SubmitPupilProgressResult => {
  if (
    result &&
    typeof result === "object" &&
    "progress" in result &&
    "status" in result &&
    writeStatuses.includes(result.status as SubmitPupilProgressResult["status"])
  ) {
    return {
      progress: pupilLessonProgressSchema.parse(result.progress),
      status: result.status as SubmitPupilProgressResult["status"],
    };
  }

  const progress = pupilLessonProgressSchema.parse(result);
  const isReadOnly =
    progress.postSubmissionState === PostSubmissionState.TURNED_IN ||
    progress.postSubmissionState === PostSubmissionState.RETURNED;

  return {
    progress,
    status: isReadOnly ? "READ_ONLY" : "PERSISTED",
  };
};

export async function POST(request: NextRequest) {
  try {
    const { accessToken, session } = hasAuthHeaders(request);

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

    return NextResponse.json(normaliseWriteResult(result), { status: 200 });
  } catch (e) {
    // return classroom submission errors without obscuring their status
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
