import { type NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";

import { createLessonAttemptPayloadSchema } from "@/node-lib/pupil-api/_types/lessonAttemptTypes";
import { pupilDatastore } from "@/node-lib/pupil-api/pupilDataStore";
import errorReporter from "@/common-lib/error-reporter";

export const revalidate = 60;

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const attemptId = searchParams.get("attempt_id");

  if (typeof attemptId !== "string" || !attemptId) {
    return NextResponse.json(
      { error: "attempt_id is required" },
      { status: 400 },
    );
  }

  const { attempts, empty } = await pupilDatastore.getLessonAttempt({
    attemptId,
  });

  if (empty) {
    return NextResponse.json({ error: "attempt not found" }, { status: 404 });
  }

  const response = NextResponse.json(attempts, { status: 200 });
  return response;
}

export async function POST(request: NextRequest) {
  let data;
  try {
    const body = await request.json();
    data = createLessonAttemptPayloadSchema.parse(body);
  } catch (e) {
    if (e instanceof ZodError) {
      errorReporter("lesson-attempt-validation")(new Error(e.message), {
        severity: "warning",
      });
      return NextResponse.json(e.format(), { status: 400 });
    }
  }

  if (!data)
    return NextResponse.json(
      { error: "Invalid request data" },
      { status: 400 },
    );

  const attemptId = data.attempt_id;
  try {
    const { empty } = await pupilDatastore.getLessonAttempt({ attemptId });
    if (!empty) {
      return NextResponse.json(
        { error: "attempt_id is a duplicate" },
        { status: 400 },
      );
    }
    const result = await pupilDatastore.logLessonAttempt(data);
    return NextResponse.json(result, { status: 201 });
  } catch (e) {
    errorReporter("lesson-attempt-logging")(e, {
      severity: "error",
    });
    return NextResponse.json({ status: 500, error: "Internal Server Error" });
  }
}
