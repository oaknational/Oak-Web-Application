/* istanbul ignore file */
import { initAuth0 } from "@auth0/nextjs-auth0/edge";

import { getConfigVar } from "@/edge-lib/getConfigVar";

export const auth0 = initAuth0({
  clientID: getConfigVar("AUTH0_CLIENT_ID"),
  clientSecret: getConfigVar("AUTH0_CLIENT_SECRET"),
  secret: getConfigVar("AUTH0_SECRET"),
  issuerBaseURL: getConfigVar("AUTH0_ISSUER_BASE_URL"),
  baseURL: getConfigVar("DEPLOY_BASE_URL"),
});
