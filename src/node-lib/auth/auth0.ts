import { initAuth0 } from "@auth0/nextjs-auth0";

import getServerConfig from "@/node-lib/getServerConfig";

export const auth0 = initAuth0({
  baseURL:
    "https://deploy-preview-2614--oak-web-application.netlify.thenational.academy/",
  clientID: getServerConfig("auth0ClientId"),
  clientSecret: getServerConfig("auth0ClientSecret"),
  secret: getServerConfig("auth0Secret"),
  issuerBaseURL: getServerConfig("auth0IssuerBaseURL"),
});
