import { NextRequest, NextResponse } from "next/server";

import {
  createClassroomErrorReporter,
  getOakGoogleClassroomAddon,
  isOakGoogleClassroomException,
} from "@/node-lib/google-classroom";

const reportError = createClassroomErrorReporter("coursework-courses");

export async function GET(request: NextRequest) {
  try {
    const accessToken = request.headers.get("Authorization");
    const session = request.headers.get("X-Oakgc-Session");

    if (!session || !accessToken) {
      return NextResponse.json(
        { message: "Authentication required" },
        { status: 401 },
      );
    }

    const oakClassroomClient = getOakGoogleClassroomAddon(request);
    const courses = await oakClassroomClient.listCourses(accessToken, session);

    return NextResponse.json({ courses }, { status: 200 });
  } catch (error) {
    if (isOakGoogleClassroomException(error)) {
      const errorObject = error.toObject();
      reportError(errorObject);
      return NextResponse.json(errorObject, { status: 400 });
    }

    reportError(error, { severity: "error" });
    return NextResponse.json(
      {
        error: "Failed to list courses",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}
