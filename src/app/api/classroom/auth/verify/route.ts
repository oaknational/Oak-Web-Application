import { NextRequest } from "next/server";

import { getOakGoogleClassroomAddon } from "@/node-lib/google-classroom";

export async function GET(request: NextRequest) {
  const oakClassroomClient = getOakGoogleClassroomAddon(request);
  const accessToken = request.headers.get("Authorization");
  const session = request.headers.get("X-Oakgc-Session");

  if (!session || !accessToken)
    return Response.json({ authenticated: false }, { status: 401 });

  const verifiedSession: {
    session: string;
    token: string;
    userProfilePicUrl?: string;
  } | null = await oakClassroomClient.verifyAuthSession(session, accessToken);

  const authenticated = !!verifiedSession;

  return Response.json(
    {
      authenticated,
      session: verifiedSession?.session,
      token: verifiedSession?.token,
      userProfilePicUrl: verifiedSession?.userProfilePicUrl,
    },
    { status: authenticated ? 200 : 401 },
  );
}
