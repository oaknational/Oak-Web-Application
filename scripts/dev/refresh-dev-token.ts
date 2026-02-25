/**
 * Dev OAuth Token Refresh Script
 *
 * Automates obtaining a fresh Google OAuth refresh token for local development.
 * Reads client credentials from .env, runs a local OAuth flow, and writes the
 * new refresh token back to .env.
 *
 * Prerequisites:
 *   1. Add http://localhost:3457/oauth2callback as an authorized redirect URI
 *      in the Google Cloud Console for the dev OAuth client.
 *      (One-time setup per OAuth app.)
 *
 * Usage:
 *   npx tsx scripts/dev/refresh-dev-token.ts
 *   — or —
 *   npm run dev:gclassroom:refresh-token
 */

import * as fs from "fs";
import * as http from "http";
import * as path from "path";
import * as url from "url";

import { config } from "dotenv";
import { OAuth2Client } from "google-auth-library";
import open from "open";

const ENV_FILE = path.resolve(__dirname, "../../.env");
const REDIRECT_PORT = 3457;
const REDIRECT_URI = `http://localhost:${REDIRECT_PORT}/oauth2callback`;

// Below should match teacher scopes in the google-classroom-addon repo
const SCOPES = [
  "https://www.googleapis.com/auth/userinfo.profile",
  "https://www.googleapis.com/auth/userinfo.email",
  "https://www.googleapis.com/auth/classroom.courses.readonly",
  "https://www.googleapis.com/auth/classroom.addons.student",
  "https://www.googleapis.com/auth/classroom.addons.teacher",
];

function updateEnvFile(refreshToken: string) {
  let envContent = fs.readFileSync(ENV_FILE, "utf-8");

  const tokenLine = `GOOGLE_CLASSROOM_DEV_REFRESH_TOKEN="${refreshToken}"`;
  const regex = /^GOOGLE_CLASSROOM_DEV_REFRESH_TOKEN=.*$/m;

  if (regex.test(envContent)) {
    envContent = envContent.replace(regex, tokenLine);
  } else {
    envContent = envContent.trimEnd() + "\n" + tokenLine + "\n";
  }

  fs.writeFileSync(ENV_FILE, envContent, "utf-8");
}

async function main() {
  config({ path: ENV_FILE });

  const clientId = process.env.GOOGLE_CLASSROOM_OAUTH_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLASSROOM_OAUTH_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    console.error(
      "Missing GOOGLE_CLASSROOM_OAUTH_CLIENT_ID or GOOGLE_CLASSROOM_OAUTH_CLIENT_SECRET in .env",
    );
    process.exit(1);
  }

  const oauth2Client = new OAuth2Client(clientId, clientSecret, REDIRECT_URI);

  const authUrl = oauth2Client.generateAuthUrl({
    access_type: "offline",
    prompt: "consent",
    scope: SCOPES,
  });

  // Start local server and wait for the OAuth callback
  const code = await new Promise<string>((resolve, reject) => {
    let server: http.Server;

    const cleanup = () => {
      server?.close();
      console.log("\nCancelled.");
      process.exit(0);
    };
    process.on("SIGINT", cleanup);
    process.on("SIGTERM", cleanup);

    server = http.createServer((req, res) => {
      const parsed = url.parse(req.url ?? "", true);

      if (parsed.pathname !== "/oauth2callback") {
        res.writeHead(404);
        res.end("Not found");
        return;
      }

      const authCode = parsed.query.code as string | undefined;
      const error = parsed.query.error as string | undefined;

      if (error) {
        res.writeHead(200, { "Content-Type": "text/html" });
        res.end(
          `<h2>Authorization failed</h2><p>${error}</p><p>You can close this tab.</p>`,
        );
        server.close();
        reject(new Error(`OAuth error: ${error}`));
        return;
      }

      if (!authCode) {
        res.writeHead(400, { "Content-Type": "text/html" });
        res.end("<h2>Missing authorization code</h2>");
        return;
      }

      res.writeHead(200, { "Content-Type": "text/html" });
      res.end(
        "<h2>Authorization successful!</h2><p>You can close this tab and return to the terminal.</p>",
      );

      server.close();
      resolve(authCode);
    });

    server.listen(REDIRECT_PORT, () => {
      console.log(
        `\nListening for OAuth callback on http://localhost:${REDIRECT_PORT}...`,
      );
      console.log("\nOpening browser for Google sign-in...");
      console.log("If the browser does not open, visit this URL manually:\n");
      console.log(authUrl);
      console.log();

      open(authUrl).catch(() => {
        // Browser open failed silently — user can use the printed URL
      });
    });

    // Timeout after 2 minutes
    const timeout = setTimeout(() => {
      server.close();
      reject(new Error("Timed out waiting for OAuth callback (2 minutes)"));
    }, 120_000);

    server.on("close", () => clearTimeout(timeout));
  });

  console.log("Authorization code received. Exchanging for tokens...");

  const { tokens } = await oauth2Client.getToken(code);

  if (!tokens.refresh_token) {
    console.error(
      "\nNo refresh token received. This usually means the account has already " +
        "granted access. Revoke access at https://myaccount.google.com/permissions " +
        "for this app and try again, or re-run with a different account.",
    );
    process.exit(1);
  }

  console.log("\nRefresh token obtained successfully.");

  updateEnvFile(tokens.refresh_token);

  console.log("Updated GOOGLE_CLASSROOM_DEV_REFRESH_TOKEN in .env");
  console.log("Done!\n");
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
