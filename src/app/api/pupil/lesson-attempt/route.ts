import { type NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";

import { createLessonAttemptPayloadSchema } from "@/app/api/pupil/_types/lessonAttemptTypes";
import { datastore } from "@/node-lib/pupil-api";
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

  const { attempts, empty } = await datastore.getLessonAttempt({ attemptId });

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

  if (data) {
    const attemptId = data.attempt_id;
    try {
      const { empty } = await datastore.getLessonAttempt({ attemptId });
      if (!empty) {
        return NextResponse.json(
          { error: "attempt_id is a duplicate" },
          { status: 400 },
        );
      } else {
        const result = await datastore.logLessonAttempt(data);
        return NextResponse.json(result, { status: 201 });
      }
    } catch (e) {
      const errorMessage =
        typeof e === "object" &&
        e !== null &&
        "message" in e &&
        typeof e.message === "string"
          ? e.message
          : "Unknown error";
      errorReporter("lesson-attempt-logging")(new Error(errorMessage), {
        severity: "warning",
      });
      return NextResponse.json({ status: 500, error: "Internal Server Error" });
    }
  } else {
    return NextResponse.json(
      { error: "Invalid request data" },
      { status: 400 },
    );
  }
}
