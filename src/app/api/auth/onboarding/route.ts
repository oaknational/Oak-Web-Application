import { NextRequest, NextResponse } from "next/server";

import { auth0 } from "@/node-lib/auth/auth0";
import { userManagementClient } from "@/node-lib/auth/userManagement";
import OakError from "@/errors/OakError";

export const POST = auth0.withApiAuthRequired(async (req: NextRequest) => {
  const res = new NextResponse();
  const session = await auth0.getSession(req, res);

  if (!session) {
    // This shouldn't be reachable unless we've misconfigured the route middleware/decorator
    throw new OakError({ code: "auth/missing-session", meta: { req } });
  }

  const appMetadata = { "owa:onboarded": true };

  // Update the user in auth0 so that they can be identified as onboarded
  // when they login in the future
  await userManagementClient.users.update(
    { id: session.user.sub },
    {
      app_metadata: appMetadata,
    },
  );

  return NextResponse.json(appMetadata, res);
});
