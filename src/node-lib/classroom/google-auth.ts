import { OAuth2Client } from "google-auth-library";

export function getGoogleAuthClient(
  authorizationHeader?: string,
): OAuth2Client {
  const client = new OAuth2Client(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    `${process.env.NEXTAUTH_URL}/api/classroom/auth/callback`,
  );
  if (!authorizationHeader || !authorizationHeader.startsWith("Bearer "))
    return client;
  const accessToken = authorizationHeader.slice(7);
  client.setCredentials({ access_token: accessToken });
  return client;
}
