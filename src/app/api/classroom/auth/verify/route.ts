import { NextRequest } from "next/server";

import { getOakGoogleClassroomAddon } from "@/node-lib/google-classroom";

export async function POST(request: NextRequest) {
  const oakClassroomClient = getOakGoogleClassroomAddon(request);
  const { session } = await request.json();

  if (!session) return Response.json({ authenticated: false }, { status: 401 });

  const verifiedSession: string | null =
    await oakClassroomClient.verifyAuthSession(session);
  const authenticated = !!verifiedSession;

  return Response.json(
    { authenticated },
    { status: authenticated ? 200 : 401 },
  );
}
