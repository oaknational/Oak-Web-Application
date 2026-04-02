import { NextRequest, NextResponse } from "next/server";

import {
  createClassroomErrorReporter,
  getOakGoogleClassroomAddon,
  isOakGoogleClassroomException,
} from "@/node-lib/google-classroom";

const reportError = createClassroomErrorReporter("coursework-context");

export async function GET(request: NextRequest) {
  try {
    const accessToken = request.headers.get("Authorization");
    const session = request.headers.get("x-oakgc-session");

    if (!session || !accessToken) {
      return NextResponse.json(
        { message: "Authentication required" },
        { status: 401 },
      );
    }

    const requestUrl = new URL(request.url);
    const assignmentToken = requestUrl.searchParams.get("assignmentToken");

    if (!assignmentToken) {
      return NextResponse.json(
        { error: "assignmentToken query parameter is required" },
        { status: 400 },
      );
    }

    const oakClassroomClient = getOakGoogleClassroomAddon(request);

    // Resolve the courseId and courseWorkId from the opaque assignmentToken.
    // This validates the token server-side — unknown tokens are rejected (fail closed).
    const courseWork =
      await oakClassroomClient.getClassroomCourseWork(assignmentToken);

    console.log(
      "[CourseWork context] getClassroomCourseWork result:",
      courseWork,
    );

    if (!courseWork) {
      return NextResponse.json(
        { error: "Assignment not found" },
        { status: 404 },
      );
    }

    // Get the pupil's submissionId from Google Classroom (userId=me).
    // getStudentSubmissionId throws explicitly if no submission is found.
    console.log(
      "[CourseWork context] fetching submissionId for courseId:",
      courseWork.courseId,
      "courseWorkId:",
      courseWork.courseWorkId,
    );
    const submissionId = await oakClassroomClient.getStudentSubmissionId(
      courseWork.courseId,
      courseWork.courseWorkId,
      accessToken,
      session,
    );

    console.log("[CourseWork context] resolved submissionId:", submissionId);
    return NextResponse.json(
      {
        submissionId,
        courseId: courseWork.courseId,
        courseWorkId: courseWork.courseWorkId,
        assignmentToken,
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
