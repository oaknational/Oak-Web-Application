import { NextRequest, NextResponse } from "next/server";
import { createAnnouncementAttachmentArgsSchema } from "@oaknational/google-classroom-addon/types";

import {
  createClassroomErrorReporter,
  getOakGoogleClassroomAddon,
} from "@/node-lib/google-classroom";
import {
  handleClassroomError,
  requireClassroomAuthHeaders,
} from "@/app/api/classroom/classroomUtils";

const reportError = createClassroomErrorReporter("create-attachment");

export async function POST(request: NextRequest) {
  try {
    const auth = requireClassroomAuthHeaders(request);
    if (auth instanceof NextResponse) return auth;
    const { accessToken, session } = auth;

    const oakClassroomClient = getOakGoogleClassroomAddon(request);
    const body = await request.json();

    const parsed = createAnnouncementAttachmentArgsSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid query", details: parsed.error.flatten() },
        { status: 400 },
      );
    }

    await oakClassroomClient.createAttachment(
      parsed.data,
      accessToken,
      session,
    );

    return NextResponse.json({}, { status: 201 });
  } catch (e) {
    return handleClassroomError(reportError, e);
  }
}
