import { NextRequest, NextResponse } from "next/server";
import { upsertPupilLessonProgressArgsSchema } from "@oaknational/google-classroom-addon/types";

import { getOakGoogleClassroomAddon } from "@/node-lib/google-classroom";

const hasAuthHeaders = (request: NextRequest) => {
  const accessToken = request.headers.get("Authorization");
  const session = request.headers.get("x-oakgc-session");
  return { accessToken, session };
};

export async function GET(request: NextRequest) {
  try {
    const requestUrl = new URL(request.url);
    const submissionId = requestUrl.searchParams.get("submissionId");
    const attachmentId = requestUrl.searchParams.get("attachmentId");
    const itemId = requestUrl.searchParams.get("itemId");
    if (!submissionId || !attachmentId || !itemId) {
      return NextResponse.json(
        { error: "submissionId, attachmentId and itemId required" },
        { status: 400 },
      );
    }

    const oakClassroomClient = getOakGoogleClassroomAddon(request);
    const result = await oakClassroomClient.getPupilLessonProgress(
      submissionId,
      attachmentId,
      itemId,
    );

    return NextResponse.json(result ?? { lessonProgress: null });
  } catch (e) {
    console.error(JSON.stringify(e));
    return NextResponse.json(
      { error: "Failed to fetch pupil lesson progress" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { accessToken, session } = hasAuthHeaders(request);

    if (!session || !accessToken)
      return NextResponse.json(
        { message: "Authentication required" },
        { status: 401 },
      );

    const oakClassroomClient = getOakGoogleClassroomAddon(request);
    const body = await request.json();

    const parsed = upsertPupilLessonProgressArgsSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid request body", details: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const result = await oakClassroomClient.upsertPupilLessonProgress(
      parsed.data,
      accessToken,
      session,
    );

    return NextResponse.json(result, { status: 200 });
  } catch (e) {
    // Check if it's an OakGoogleClassroomException with submission state error
    if (
      e &&
      typeof e === "object" &&
      "name" in e &&
      (e as { name: string }).name === "OakGoogleClassroomException"
    ) {
      return NextResponse.json(e, { status: 403 });
    }
    console.error(JSON.stringify(e));
    return NextResponse.json({ error: e }, { status: 500 });
  }
}
