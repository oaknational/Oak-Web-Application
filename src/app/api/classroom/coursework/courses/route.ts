import { NextRequest, NextResponse } from "next/server";

import {
  createClassroomErrorReporter,
  getOakGoogleClassroomAddon,
} from "@/node-lib/google-classroom";
import {
  extractTeacherAuth,
  handleCourseWorkApiError,
  unauthorizedResponse,
} from "@/app/api/classroom/coursework/courseWorkApiHelpers";

const reportError = createClassroomErrorReporter("coursework-courses");

export async function GET(request: NextRequest) {
  try {
    const auth = extractTeacherAuth(request);

    if (!auth) {
      return unauthorizedResponse();
    }

    const oakClassroomClient = getOakGoogleClassroomAddon(request);
    const courses = await oakClassroomClient.listCourses(
      auth.accessToken,
      auth.session,
    );

    return NextResponse.json({ courses }, { status: 200 });
  } catch (error) {
    return handleCourseWorkApiError(
      error,
      reportError,
      "Failed to list courses",
    );
  }
}
