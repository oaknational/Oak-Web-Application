import { OakGoogleClassroomAddOn } from "@oaknational/google-classroom-addon/server";

import { getPupilFirestore } from "@/node-lib/firestore";

export const getOakGoogleClassroomAddon = () => {
  const env = [
    process.env.GOOGLE_CLASSROOM_ENCRYPTION_SECRET,
    process.env.GOOGLE_CLASSROOM_OAUTH_CLIENT_ID,
    process.env.GOOGLE_CLASSROOM_OAUTH_CLIENT_SECRET,
    process.env.GOOGLE_CLASSROOM_API_BASE_URL,
    process.env.GOOGLE_CLASSROOM_SESSION_SECRET,
  ];
  if (!env.every((e) => typeof e === "string")) {
    throw new Error(
      "OakGoogleClassroomAddOn is missing required environment variables",
    );
  }
  const [encryptionSecret, oauthClientId, oauthSecret, baseUrl, sessionSecret] =
    env;
  const pupilFirestore = getPupilFirestore();
  return new OakGoogleClassroomAddOn(
    encryptionSecret as string,
    pupilFirestore,
    oauthClientId as string,
    oauthSecret as string,
    `${baseUrl}/api/classroom/auth/callback`,
    sessionSecret as string,
  );
};
