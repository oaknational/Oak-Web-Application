import graphqlApi from ".";

const configGetSpy = jest.fn((key: string) => {
  if (key === "graphqlApiUrl") {
    return "gql endpoint";
  }
  if (key === "hasuraAdminSecret") {
    return "hasura secret";
  }
});
const GraphQLClientSpy = jest.fn();
jest.mock("./generated/sdk", () => ({
  getSdk: jest.fn(() => "the sdk"),
}));

describe("node-lib/graphql/index.ts", () => {
  beforeEach(() => {
    jest.resetModules();
    jest.restoreAllMocks();
    jest.mock("../../config/server", () => ({
      get: configGetSpy,
    }));
    jest.mock("graphql-request", () => ({
      GraphQLClient: GraphQLClientSpy,
    }));
  });
  it("should return the sdk", () => {
    expect(graphqlApi).toBe("the sdk");
  });
  it("should use graphqlApiUrl from config", async () => {
    await import(".");
    expect(configGetSpy).toHaveBeenCalledWith("graphqlApiUrl");
  });
  it("should use hasuraAdminSecret from config", async () => {
    await import(".");
    expect(configGetSpy).toHaveBeenCalledWith("hasuraAdminSecret");
  });
  it("should set x-hasura-admin-secret headers", async () => {
    await import(".");
    expect(GraphQLClientSpy).toHaveBeenCalledWith("gql endpoint", {
      headers: { "x-hasura-admin-secret": "hasura secret" },
    });
  });
});

export {};
