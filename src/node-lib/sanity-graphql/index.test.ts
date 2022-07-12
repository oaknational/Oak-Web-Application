import graphqlApi from ".";

const configGetSpy = jest.fn((key: string) => {
  if (key === "sanityGraphqlApiUrl") {
    return "gql endpoint";
  }
  if (key === "sanityGraphqlApiSecret") {
    return "sanity-secret";
  }
});
const GraphQLClientSpy = jest.fn();
jest.mock("./generated/sdk", () => ({
  getSdk: jest.fn(() => "the sdk"),
}));

describe("node-lib/sanity-graphql/index.ts", () => {
  beforeEach(() => {
    jest.resetModules();
    jest.restoreAllMocks();
    jest.mock("../../config", () => ({
      get: configGetSpy,
    }));
    jest.mock("graphql-request", () => ({
      GraphQLClient: GraphQLClientSpy,
    }));
  });
  it("should return the sdk", () => {
    expect(graphqlApi).toBe("the sdk");
  });
  it("should use sanityGraphqlApiUrl from config", async () => {
    await import(".");
    expect(configGetSpy).toHaveBeenCalledWith("sanityGraphqlApiUrl");
  });
  it("should use sanityGraphqlApiSecret from config", async () => {
    await import(".");
    expect(configGetSpy).toHaveBeenCalledWith("sanityGraphqlApiSecret");
  });
  it("should set auth headers", async () => {
    await import(".");
    expect(GraphQLClientSpy).toHaveBeenCalledWith("gql endpoint", {
      headers: { "Accept": "Bearer sanity-secret" },
    });
  });
});

export {};
