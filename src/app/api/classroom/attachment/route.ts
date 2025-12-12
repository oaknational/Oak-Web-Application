import { NextRequest } from "next/server";

import { getOakGoogleClassroomAddon } from "@/node-lib/google-classroom";

export async function POST(request: NextRequest) {
  try {
    const accessToken = await request.headers.get("Authorization");
    const session = await request.headers.get("x-oakgc-session");

    if (!session || !accessToken)
      return Response.json(
        { message: "Authentication required" },
        { status: 401 },
      );

    const oakClassroomClient = getOakGoogleClassroomAddon(request);
    const {
      courseId,
      itemId,
      addOnToken,
      title,
      lessonSlug,
      programeSlug,
      unitSlug,
    } = await request.json();

    if (
      !courseId ||
      !itemId ||
      !addOnToken ||
      !title ||
      !lessonSlug ||
      !programeSlug ||
      !unitSlug
    )
      return Response.json({ message: "Missing properties" }, { status: 400 });

    if (!session)
      return Response.json({ message: "Missing auth header" }, { status: 400 });

    await oakClassroomClient.createAttachment(
      {
        courseId,
        itemId,
        addOnToken,
        title,
        lessonSlug,
        programeSlug,
        unitSlug,
      },
      accessToken,
      session,
    );

    return Response.json({}, { status: 201 });
  } catch (e) {
    console.error(JSON.stringify(e));
    return Response.json({ error: e }, { status: 500 });
  }
}
