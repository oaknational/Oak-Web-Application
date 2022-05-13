const { getSecretNamesFromPublicConfig } = require("./helpers");

describe("get_secret_names_from_public_config.js", () => {
  test("it correcly gets the secret names", () => {
    const secretNames = getSecretNamesFromPublicConfig({
      bugsnag: {
        apiKey: "123abc",
      },
      firebase: {
        apiHost: "https://example.com",
        apiKey: "123abc",
        appId: "12345",
        authDomain: "https://example.com",
        messagingSenderId: "abc123",
        projectId: "my_project",
        requiredSecrets: [
          "FIREBASE_SERVICE_ACCOUNT",
          "FIREBASE_ADMIN_DATABASE_URL",
        ],
        storageBucket: "bucket_uri",
        tokenHost: "https://example.com",
      },
      hasura: {
        graphqlApiUrl: "https://example.com",
        requiredSecrets: ["HASURA_ADMIN_SECRET"],
      },
      oak: {
        appBaseUrl: "http://localhost:3000",
        appName: "Samara",
      },
    });

    expect(secretNames).toEqual([
      "FIREBASE_SERVICE_ACCOUNT",
      "FIREBASE_ADMIN_DATABASE_URL",
      "HASURA_ADMIN_SECRET",
    ]);
  });
});
