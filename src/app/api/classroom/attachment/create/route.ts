import { NextRequest, NextResponse } from "next/server";

import { getOakGoogleClassroomAddon } from "@/node-lib/google-classroom";

export async function POST(req: NextRequest) {
  const accessToken = await req.headers.get("Authorization");
  const session = await req.headers.get("x-oakgc-session");
  const oakClassroomClient = getOakGoogleClassroomAddon(req);
  const args = await req.json();

  if (!session || !accessToken) {
    return NextResponse.json(
      { error: "Authentication required" },
      { status: 401 },
    );
  }

  try {
    const attachment = await oakClassroomClient.createAttachment(
      args,
      accessToken,
      session,
    );
    return NextResponse.json({ attachment }, { status: 201 });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
