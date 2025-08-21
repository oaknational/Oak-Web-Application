import { NextApiRequest, NextApiResponse } from "next";

import { getGoogleAuthClient } from "@/node-lib/classroom/google-auth";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const code = req.query.code?.toString();

  if (!code) {
    res.redirect("/500");
    return;
  }

  const authClient = getGoogleAuthClient();

  const { tokens } = await authClient.getToken(code);

  // Verify the tokens we received.
  const ticket = await authClient.verifyIdToken({
    idToken: tokens.id_token!,
    audience: process.env.GOOGLE_CLIENT_ID,
  });

  // After verifying the token we can access the payload.
  const info = ticket.getPayload();

  // Build a user object from payload and tokens.
  const user = {
    sub: info?.sub,
    email: info?.email,
    displayName: info?.name,
    portraitUrl: info?.picture,
    refreshToken: tokens.refresh_token!, // only received on first sign in
    tokens,
  };

  console.log("user:", user);
  console.log("tokens:", tokens);

  res.redirect(
    307,
    `/classroom/add-on/closepopup?authtoken=${tokens.access_token}`,
  );
}
