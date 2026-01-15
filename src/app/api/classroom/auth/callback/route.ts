import { NextRequest, NextResponse } from "next/server";
import { redirect } from "next/navigation";
import { codeSchema } from "@oaknational/google-classroom-addon/types";

import { getOakGoogleClassroomAddon } from "@/node-lib/google-classroom";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get("code");
  const subscribeToNewsletter = searchParams.get("subscribeToNewsletter");
  const parsedCode = codeSchema.safeParse(code);
  if (!parsedCode.success) {
    return NextResponse.json("code is required", { status: 400 });
  }
  const tempSignUpToNewsletter = async (email: string) => {
    // This is temp until we have actual mailing list to subscribe to
    // NOTE: This will fire on re-sign ins, so perform existence checks first
    console.log("should subscribe to newsletter", email);
  };
  const oakClassroomClient = getOakGoogleClassroomAddon(request);
  const { encryptedSession, accessToken } =
    await oakClassroomClient.handleGoogleSignInCallback(
      parsedCode.data,
      subscribeToNewsletter === "true" ? tempSignUpToNewsletter : undefined,
    );
  return redirect(
    `/classroom/auth/success?s=${encodeURIComponent(encryptedSession)}&at=${accessToken}`,
  );
}
