import { NextApiRequest, NextApiResponse } from "next";

import { getGoogleAuthClient } from "@/node-lib/classroom/google-auth";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const authClient = getGoogleAuthClient();

  const { login_hint } = req.query;

  const scope = [
    "https://www.googleapis.com/auth/userinfo.profile",
    "https://www.googleapis.com/auth/userinfo.email",
    "https://www.googleapis.com/auth/classroom.courses.readonly",
    "https://www.googleapis.com/auth/classroom.addons.student",
    "https://www.googleapis.com/auth/classroom.addons.teacher",
  ];

  const authUrl = authClient.generateAuthUrl({
    access_type: "offline",
    include_granted_scopes: true,
    scope,
    login_hint: login_hint?.toString() ?? undefined,
  });

  res.status(200).json({ authUrl });
}
