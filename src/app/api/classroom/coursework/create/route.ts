import { NextRequest, NextResponse } from "next/server";
import z from "zod";

import {
  createClassroomErrorReporter,
  getOakGoogleClassroomAddon,
  isOakGoogleClassroomException,
} from "@/node-lib/google-classroom";

const reportError = createClassroomErrorReporter("coursework-create");

const createCourseWorkBodySchema = z.object({
  courseId: z.string(),
  title: z.string().min(1),
  description: z.string().optional(),
  lessonSlug: z.string(),
  programmeSlug: z.string(),
  unitSlug: z.string(),
  maxPoints: z.number().int().min(0).default(10),
});

export async function POST(request: NextRequest) {
  try {
    const accessToken = request.headers.get("Authorization");
    const session = request.headers.get("X-Oakgc-Session");

    if (!session || !accessToken) {
      return NextResponse.json(
        { message: "Authentication required" },
        { status: 401 },
      );
    }

    const body = await request.json();
    const parsed = createCourseWorkBodySchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid request body", details: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const oakClassroomClient = getOakGoogleClassroomAddon(request);
    const result = await oakClassroomClient.createCourseWork(
      parsed.data,
      accessToken,
      session,
    );

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    if (isOakGoogleClassroomException(error)) {
      const errorObject = error.toObject();
      reportError(errorObject);
      return NextResponse.json(errorObject, { status: 400 });
    }

    reportError(error, { severity: "error" });
    return NextResponse.json(
      {
        error: "Failed to create CourseWork",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}
