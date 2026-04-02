import { NextRequest, NextResponse } from "next/server";

import {
  createClassroomErrorReporter,
  getOakGoogleClassroomAddon,
  isOakGoogleClassroomException,
} from "@/node-lib/google-classroom";

const reportError = createClassroomErrorReporter("coursework-lesson-info");

export async function GET(request: NextRequest) {
  try {
    const requestUrl = new URL(request.url);
    const assignmentToken = requestUrl.searchParams.get("assignmentToken");

    if (!assignmentToken) {
      return NextResponse.json(
        { error: "assignmentToken query parameter is required" },
        { status: 400 },
      );
    }

    const oakClassroomClient = getOakGoogleClassroomAddon(request);
    const courseWork =
      await oakClassroomClient.getClassroomCourseWork(assignmentToken);

    if (!courseWork) {
      return NextResponse.json(
        { error: "Assignment not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(
      {
        lessonSlug: courseWork.lessonSlug,
        programmeSlug: courseWork.programmeSlug,
        unitSlug: courseWork.unitSlug,
      },
      { status: 200 },
    );
  } catch (e) {
    const errorObject = isOakGoogleClassroomException(e) ? e.toObject() : e;
    reportError(errorObject);
    return NextResponse.json(
      { error: e instanceof Error ? e.message : String(e) },
      { status: 500 },
    );
  }
}
