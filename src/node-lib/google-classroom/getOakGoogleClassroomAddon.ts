import { OakGoogleClassroomAddOn } from "@oaknational/google-classroom-addon/server";
import type { NextRequest } from "next/server";

import { getPupilFirestore } from "@/node-lib/firestore";

export const getOakGoogleClassroomAddon = (req: NextRequest) => {
  const protocol = req.headers.get("x-forwarded-proto") || "https";
  const host = req.headers.get("host");
  const baseUrl = `${protocol}://${host}`;

  const env = [
    process.env.GOOGLE_CLASSROOM_ENCRYPTION_SECRET,
    process.env.GOOGLE_CLASSROOM_OAUTH_CLIENT_ID,
    process.env.GOOGLE_CLASSROOM_OAUTH_CLIENT_SECRET,
    process.env.GOOGLE_CLASSROOM_SESSION_SECRET,
  ];
  if (!env.every((e) => typeof e === "string")) {
    throw new Error(
      "OakGoogleClassroomAddOn is missing required environment variables",
    );
  }
  const [encryptionSecret, oauthClientId, oauthSecret, sessionSecret] = env;
  const pupilFirestore = getPupilFirestore();
  return new OakGoogleClassroomAddOn(
    encryptionSecret as string,
    pupilFirestore,
    oauthClientId as string,
    oauthSecret as string,
    `${baseUrl}/api/classroom/auth/callback`,
    sessionSecret as string,
    baseUrl,
  );
};
