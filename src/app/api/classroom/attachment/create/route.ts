import { NextRequest, NextResponse } from "next/server";

import { getOakGoogleClassroomAddon } from "@/node-lib/google-classroom";

export async function POST(req: NextRequest) {
  const oakClassroomClient = getOakGoogleClassroomAddon(req);
  const args = await req.json();
  try {
    const attachment = await oakClassroomClient.createAttachment(args);
    return NextResponse.json({ attachment }, { status: 201 });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    console.log("Error creating attachment:", errorMessage);
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
