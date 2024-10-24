import { Client } from "@hubspot/api-client";

import getServerConfig from "@/node-lib/getServerConfig";

/**
 * Singleton instance of the Hubspot client
 */
export const hubspotClient = new Client({
  accessToken: getServerConfig("hubspotOwaAccessToken"),
});
