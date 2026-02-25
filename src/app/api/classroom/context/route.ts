import { NextRequest, NextResponse } from "next/server";
import z from "zod";

import { getOakGoogleClassroomAddon } from "@/node-lib/google-classroom";

const getAddOnContextSchema = z.object({
  courseId: z.string(),
  itemId: z.string(),
  attachmentId: z.string(),
});

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
    console.error(JSON.stringify(e));
    return NextResponse.json({ error: e }, { status: 500 });
  }
}
