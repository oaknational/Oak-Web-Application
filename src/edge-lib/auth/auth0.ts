/* istanbul ignore file */
import { initAuth0 } from "@auth0/nextjs-auth0/edge";

import { getEnvVar } from "@/edge-lib/getEnvVar";

export const auth0 = initAuth0({
  baseURL: getEnvVar("AUTH0_ISSUER_BASE_URL"),
  clientID: getEnvVar("AUTH0_CLIENT_ID"),
  clientSecret: getEnvVar("AUTH0_CLIENT_SECRET"),
  secret: getEnvVar("AUTH0_SECRET"),
  issuerBaseURL: getEnvVar("AUTH0_ISSUER_BASE_URL"),
});
