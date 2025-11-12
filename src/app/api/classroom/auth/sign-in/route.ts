import type { NextRequest } from "next/server";

import { getOakGoogleClassroomAddon } from "@/node-lib/google-classroom";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const loginHint = searchParams.get("login_hint") ?? undefined;

  const oakClassroomClient = getOakGoogleClassroomAddon(request);
  const response = await oakClassroomClient.getGoogleSignInUrl(loginHint);

  return Response.json({ signInUrl: response }, { status: 200 });
}
