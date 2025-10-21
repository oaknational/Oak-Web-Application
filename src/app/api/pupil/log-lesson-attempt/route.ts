import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";

import { createLessonAttemptPayloadSchema } from "@/app/api/types/pupil-api/types";
import { datastore } from "@/node-lib/firestore/services/datastore";
import { handleCors } from "@/app/api/_utils/cors";

export async function POST(request: NextRequest) {
  const corsResponse = handleCors(request);
  if (corsResponse) {
    return corsResponse;
  }

  let data;
  try {
    const body = await request.json();
    data = createLessonAttemptPayloadSchema.parse(body);
  } catch (e) {
    if (e instanceof ZodError) {
      return NextResponse.json(e.format(), { status: 400 });
    }
    throw e;
  }

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
    // You may want to log the error here
    const result = await datastore.logLessonAttempt(data);
    return NextResponse.json(result, { status: 201 });
  }
}
