import graphqlApi from ".";

const configGetSpy = jest.fn((key: string) => {
  return {
    sanityProjectId: "the-project",
    sanityDataset: "the-dataset",
    sanityDatasetTag: "the-tag",
    sanityUseCDN: true,
    sanityGraphqlApiSecret: "sanity-secret",
  }[key];
});
const GraphQLClientSpy = jest.fn();
jest.mock("./generated/sdk", () => ({
  getSdk: jest.fn(() => "the sdk"),
}));

describe("node-lib/sanity-graphql/index.ts", () => {
  beforeEach(() => {
    jest.resetModules();
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

  it("should build the API endpoint from config", async () => {
    await import(".");
    expect(GraphQLClientSpy).toHaveBeenCalledWith(
      "https://the-project.api.sanity.io/v1/graphql/the-dataset/the-tag",
      expect.any(Object)
    );
  });

  it("should set auth headers", async () => {
    await import(".");
    expect(GraphQLClientSpy).toHaveBeenCalledWith(expect.any(String), {
      headers: { Authorization: "Bearer sanity-secret" },
    });
  });
});

export {};
