import { NextRequest, NextResponse } from "next/server";
import z from "zod";

import {
  createClassroomErrorReporter,
  getOakGoogleClassroomAddon,
} from "@/node-lib/google-classroom";
import {
  handleClassroomError,
  requireClassroomAuthHeaders,
} from "@/app/api/classroom/classroomUtils";

const getAddOnContextSchema = z.object({
  courseId: z.string(),
  itemId: z.string(),
  attachmentId: z.string(),
});

const reportError = createClassroomErrorReporter("addon-context");

export async function POST(request: NextRequest) {
  try {
    const auth = requireClassroomAuthHeaders(request);
    if (auth instanceof NextResponse) return auth;
    const { accessToken, session } = auth;

    const oakClassroomClient = getOakGoogleClassroomAddon(request);
    const body = await request.json();

    const parsed = getAddOnContextSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid request body", details: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const context = await oakClassroomClient.getAddOnContext(
      parsed.data.courseId,
      parsed.data.itemId,
      parsed.data.attachmentId,
      accessToken,
      session,
    );

    return NextResponse.json(context, { status: 200 });
  } catch (e) {
    return handleClassroomError(reportError, e);
  }
}
