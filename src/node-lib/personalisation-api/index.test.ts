import {
  getAuthenticatedPersonalisationApi,
  getWebhookPersonalisationApi,
} from ".";

jest.mock("graphql-request", () => ({
  GraphQLClient: jest.fn().mockImplementation(() => ({
    request: jest.fn().mockReturnValue(Promise.resolve({})),
  })),
}));

const getToken = jest.fn().mockReturnValue("token");

describe("Personalisation API", () => {
  test("getAuthenticatedPersonalisationApi should return a personalisation api", async () => {
    const api = await getAuthenticatedPersonalisationApi(getToken);
    expect(getToken).toHaveBeenCalled();
    expect(api).toBeDefined();
    expect(api.createUser).toBeDefined();
    expect(api.getUser).toBeDefined();
  });
  test("getAuthenticatedPersonalisationApi should throw and error if get token failes", async () => {
    getToken.mockReturnValue(null);
    await expect(getAuthenticatedPersonalisationApi(getToken)).rejects.toThrow(
      "Failed to retrieve token",
    );
  });
  test("getWebhookPersonalisationApi should return a personalisation api", async () => {
    const api = await getWebhookPersonalisationApi("userId");
    expect(api).toBeDefined();
  });
});
