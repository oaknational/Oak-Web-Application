import { NextRequest, NextResponse } from "next/server";
import { createAnnouncementAttachmentArgsSchema } from "@oaknational/google-classroom-addon/types";

import {
  createClassroomErrorReporter,
  getOakGoogleClassroomAddon,
  isOakGoogleClassroomException,
} from "@/node-lib/google-classroom";

const reportError = createClassroomErrorReporter("create-attachment");

export async function POST(request: NextRequest) {
  try {
    const accessToken = request.headers.get("Authorization");
    const session = request.headers.get("x-oakgc-session");

    if (!session || !accessToken)
      return NextResponse.json(
        { message: "Authentication required" },
        { status: 401 },
      );

    const oakClassroomClient = getOakGoogleClassroomAddon(request);
    const body = await request.json();

    const parsed = createAnnouncementAttachmentArgsSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid query", details: parsed.error.flatten() },
        { status: 400 },
      );
    }
    // this isn't reachable because of initial session check
    if (!session)
      return NextResponse.json(
        { message: "Missing auth header" },
        { status: 400 },
      );

    await oakClassroomClient.createAttachment(
      parsed.data,
      accessToken,
      session,
    );

    return NextResponse.json({}, { status: 201 });
  } catch (e) {
    const errorObject = isOakGoogleClassroomException(e) ? e.toObject() : e;
    reportError(errorObject);
    return NextResponse.json(
      { error: e instanceof Error ? e?.message : String(e) },
      { status: 500 },
    );
  }
}
