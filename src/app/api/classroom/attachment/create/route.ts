import { NextRequest, NextResponse } from "next/server";
import { createAnnouncementAttachmentArgsSchema } from "@oaknational/google-classroom-addon/types";

import { getOakGoogleClassroomAddon } from "@/node-lib/google-classroom";

export async function POST(request: NextRequest) {
  try {
    const accessToken = await request.headers.get("Authorization");
    const session = await request.headers.get("x-oakgc-session");

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
    console.error(JSON.stringify(e));
    return NextResponse.json({ error: e }, { status: 500 });
  }
}
