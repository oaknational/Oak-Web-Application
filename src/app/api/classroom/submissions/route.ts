import { NextRequest, NextResponse } from "next/server";

import { getOakGoogleClassroomAddon } from "@/node-lib/google-classroom";

export async function POST(request: NextRequest) {
  try {
    const accessToken = request.headers.get("Authorization");
    const session = request.headers.get("x-oakgc-session");
    const body = await request.json();

    // const searchParams = request.nextUrl.searchParams;
    console.log("BODY", body);
    const courseId = body.courseId || "";
    const itemId = body.itemId || "";
    const attachmentId = body.attachmentId || "";
    const pointsEarned = Number(body.pointsEarned || 0);
    const sectionResults = body.sectionResults || {};
    console.log("HEADERS", { accessToken, session });

    if (!session || !accessToken)
      return NextResponse.json(
        { message: "Authentication required" },
        { status: 401 },
      );

    const oakClassroomClient = getOakGoogleClassroomAddon(request);

    if (!session)
      return NextResponse.json(
        { message: "Missing auth header" },
        { status: 400 },
      );

    const submissionData = await oakClassroomClient.submitStudentSubmission(
      {
        courseId,
        itemId,
        attachmentId,
        pointsEarned,
        sectionResults,
      },
      accessToken,
      session,
    );
    console.log("SUBMISSION DATA", submissionData);
    return NextResponse.json({}, { status: 201 });
  } catch (e) {
    console.error(JSON.stringify(e));
    return NextResponse.json({ error: e }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  const submissionId = request.nextUrl.searchParams.get("submissionId");
  const oakClassroomClient = getOakGoogleClassroomAddon(request);
  const submission = await oakClassroomClient.fetchStudentSubmission(
    submissionId || "",
  );
  console.log("FETCHED SUBMISSION", submission);
  return NextResponse.json(submission, { status: 200 });
}
