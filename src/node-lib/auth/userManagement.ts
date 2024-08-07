/* istanbul ignore file */
import { ManagementClient } from "auth0";

import getServerConfig from "../getServerConfig";

export const userManagementClient = new ManagementClient({
  domain: getServerConfig("auth0IssuerBaseURL").replace("https://", ""),
  clientId: getServerConfig("auth0UserManagementClientId"),
  clientSecret: getServerConfig("auth0UserManagementClientSecret"),
});
