import { NextRequest, NextResponse } from "next/server";
import z from "zod";

import {
  createClassroomErrorReporter,
  getOakGoogleClassroomAddon,
  isOakGoogleClassroomException,
} from "@/node-lib/google-classroom";
import { getPupilFirestore } from "@/node-lib/firestore";

const getAddOnContextSchema = z.object({
  courseId: z.string(),
  itemId: z.string(),
  attachmentId: z.string(),
});

const reportError = createClassroomErrorReporter("addon-context");

const getTeacherLoginHint = async (attachmentId: string) => {
  try {
    const firestore = getPupilFirestore();
    const attachmentSnapshot = await firestore
      .collection("classroomAttachments")
      .doc(attachmentId)
      .get();

    return attachmentSnapshot.data()?.teacherLoginHint ?? null;
  } catch {
    return null;
  }
};

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

    const teacherLoginHint = await getTeacherLoginHint(
      parsed.data.attachmentId,
    );
    return NextResponse.json({ ...context, teacherLoginHint }, { status: 200 });
  } catch (e) {
    const errorObject = isOakGoogleClassroomException(e) ? e.toObject() : e;
    reportError(errorObject);
    return NextResponse.json(
      { error: e instanceof Error ? e?.message : String(e) },
      { status: 500 },
    );
  }
}
