const { getSecretNamesFromPublicConfig } = require("./helpers");

describe("get_secret_names_from_public_config.js", () => {
  test("it correcly gets the secret names", () => {
    const secretNames = getSecretNamesFromPublicConfig({
      bugsnag: {
        apiKey: "123abc",
      },
      service: {
        graphqlApiUrl: "https://example.com",
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
