import { NextRequest } from "next/server";

import { getOakGoogleClassroomAddon } from "@/node-lib/google-classroom";

export async function GET(request: NextRequest) {
  const oakClassroomClient = getOakGoogleClassroomAddon(request);
  const accessToken = await request.headers.get("Authorization");
  const session = await request.headers.get("X-Oakgc-Session");

  if (!session || !accessToken)
    return Response.json({ authenticated: false }, { status: 401 });

  const verifiedSession: { session: string; token: string } | null =
    await oakClassroomClient.verifyAuthSession(session, accessToken);

  const authenticated = !!verifiedSession;

  return Response.json(
    {
      authenticated,
      session: verifiedSession?.session,
      token: verifiedSession?.token,
    },
    { status: authenticated ? 200 : 401 },
  );
}
