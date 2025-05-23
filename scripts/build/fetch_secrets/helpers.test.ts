import { OakConfig } from "../fetch_config/config_types";

import { getSecretNamesFromPublicConfig } from "./helpers";

describe("get_secret_names_from_public_config.js", () => {
  test("it correctly gets the secret names", () => {
    const secretNames = getSecretNamesFromPublicConfig({
      bugsnag: {
        apiKey: "123abc",
      },
      service: {
        curriculumApiUrl: "https://example.com",
        requiredSecrets: ["SERVICE_SECRET"],
      },
      oak: {
        appBaseUrl: "http://localhost:3000",
        requiredSecrets: ["OAK_SECRET_101"],
      },
    } as unknown as OakConfig);

    expect(secretNames).toEqual(["SERVICE_SECRET", "OAK_SECRET_101"]);
  });
});
