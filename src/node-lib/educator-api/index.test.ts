import { getAuthenticatedEducatorApi, getWebhookEducatorApi } from ".";

jest.mock("graphql-request", () => ({
  GraphQLClient: jest.fn().mockImplementation(() => ({
    request: jest.fn().mockReturnValue(Promise.resolve({})),
  })),
}));

const getToken = jest.fn().mockReturnValue("token");

describe("Educator API", () => {
  test("getAuthenticatedEducatorApi should return an educator api", async () => {
    const api = await getAuthenticatedEducatorApi(getToken);
    expect(getToken).toHaveBeenCalled();
    expect(api).toBeDefined();
    expect(api.createUser).toBeDefined();
    expect(api.getUser).toBeDefined();
  });
  test("getAuthenticatedEducatorApi should throw and error if get token failes", async () => {
    getToken.mockReturnValue(null);
    await expect(getAuthenticatedEducatorApi(getToken)).rejects.toThrow(
      "Failed to retrieve token",
    );
  });
  test("getWebhookEducatorApi should return an educator api", async () => {
    const api = await getWebhookEducatorApi("userId");
    expect(api).toBeDefined();
  });
});
