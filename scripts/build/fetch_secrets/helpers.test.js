// eslint-disable-next-line import/named
import { describe, it, expect } from "vitest";

const { getSecretNamesFromPublicConfig } = require("./helpers");

describe("get_secret_names_from_public_config.js", () => {
  it("it correcly gets the secret names", () => {
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
    });

    expect(secretNames).toEqual(["SERVICE_SECRET", "OAK_SECRET_101"]);
  });
});
