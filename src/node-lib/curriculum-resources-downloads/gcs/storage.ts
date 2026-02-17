import { Storage } from "@google-cloud/storage";

import getServerConfig from "@/node-lib/getServerConfig";

export const storage = new Storage({
  credentials: {
    type: "service_account",
    private_key: getServerConfig("googleServiceAccountPrivateKey"),
    client_email: getServerConfig("googleServiceAccountEmail"),
  },
});
