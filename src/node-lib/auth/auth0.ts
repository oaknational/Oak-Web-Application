import { initAuth0 } from "@auth0/nextjs-auth0";

import getServerConfig from "@/node-lib/getServerConfig";
import getBrowserConfig from "@/browser-lib/getBrowserConfig";

export const auth0 = initAuth0({
  baseURL: getBrowserConfig("clientAppBaseUrl"),
  clientID: getServerConfig("auth0ClientId"),
  clientSecret: getServerConfig("auth0ClientSecret"),
  secret: getServerConfig("auth0Secret"),
  issuerBaseURL: getServerConfig("auth0IssuerBaseURL"),
});
