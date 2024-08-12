/* istanbul ignore file */
import { auth0 } from "@/edge-lib/auth/auth0";
import getServerConfig from "@/node-lib/getServerConfig";

const oidcLogoutUrl = new URL(getServerConfig("auth0IssuerBaseURL"));
oidcLogoutUrl.pathname = "/oidc/logout";
oidcLogoutUrl.searchParams.set("client_id", getServerConfig("auth0ClientId"));

export const runtime = "edge";
export const GET = auth0.handleAuth({
  // This is a temporary convenience endpoint to allow us to fully log a user out of both OWA and Auth0
  // it enables us to more easily test signup/login with different accounts
  "oidc-logout": auth0.handleLogout({
    returnTo: oidcLogoutUrl.toString(),
  }),
});
