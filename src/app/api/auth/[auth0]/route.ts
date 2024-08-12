/* istanbul ignore file */
import { auth0 } from "@/edge-lib/auth/auth0";
import { getConfigVar } from "@/edge-lib/getConfigVar";

const oidcLogoutUrl = new URL(getConfigVar("AUTH0_ISSUER_BASE_URL"));
oidcLogoutUrl.pathname = "/oidc/logout";
oidcLogoutUrl.searchParams.set("client_id", getConfigVar("AUTH0_CLIENT_ID"));

export const runtime = "edge";
export const GET = auth0.handleAuth({
  // This is a temporary convenience endpoint to allow us to fully log a user out of both OWA and Auth0
  // it enables us to more easily test signup/login with different accounts
  "oidc-logout": auth0.handleLogout({
    returnTo: oidcLogoutUrl.toString(),
  }),
});
