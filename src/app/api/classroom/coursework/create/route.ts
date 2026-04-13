import { NextRequest, NextResponse } from "next/server";

import {
  createClassroomErrorReporter,
  createCourseWorkBodySchema,
  getOakGoogleClassroomAddon,
} from "@/node-lib/google-classroom";
import {
  extractAuth,
  handleCourseWorkApiError,
  unauthorisedResponse,
} from "@/app/api/classroom/coursework/courseWorkApiHelpers";

const reportError = createClassroomErrorReporter("coursework-create");

export async function POST(request: NextRequest) {
  try {
    const auth = extractAuth(request);

    if (!auth) {
      return unauthorisedResponse();
    }

    const body = await request.json();
    const parsed = createCourseWorkBodySchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid request body", details: parsed.error.issues },
        { status: 400 },
      );
    }

    const oakClassroomClient = getOakGoogleClassroomAddon(request);
    const result = await oakClassroomClient.createCourseWork(
      parsed.data,
      auth.accessToken,
      auth.session,
    );

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    return handleCourseWorkApiError(
      error,
      reportError,
      "Failed to create CourseWork",
    );
  }
}
