import graphqlApi, { requestWithLogging } from ".";

const configGetSpy = vi.fn((key: string) => {
  return {
    sanityProjectId: "the-project",
    sanityDataset: "the-dataset",
    sanityDatasetTag: "the-tag",
    sanityUseCDN: true,
    sanityGraphqlApiSecret: "sanity-secret",
  }[key];
});
const GraphQLClientSpy = vi.fn();
vi.mock("./generated/sdk", () => ({
  getSdk: vi.fn(() => "the sdk"),
}));

const reportError = vi.fn();
vi.mock("../../common-lib/error-reporter", () => ({
  __esModule: true,
  default:
    () =>
    (...args: []) =>
      reportError(...args),
}));

describe("node-lib/sanity-graphql/index.ts", () => {
  beforeEach(() => {
    vi.resetModules();

    vi.mock("../getServerConfig", () => ({
      __esModule: true,
      default: configGetSpy,
    }));
    vi.mock("graphql-request", () => ({
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
      expect.any(Object),
    );
  });

  it("should set auth headers", async () => {
    await import(".");
    expect(GraphQLClientSpy).toHaveBeenCalledWith(expect.any(String), {
      headers: { Authorization: "Bearer sanity-secret" },
    });
  });

  it("requestWithLogging should call the given action", async () => {
    const actionResult = {};
    const action = vi.fn().mockResolvedValue(actionResult);

    const res = await requestWithLogging(action, "someOperation");

    expect(res).toBe(actionResult);
  });

  it("requestWithLogging should report graphql errors to bugsnag", async () => {
    const originalError = new Error(`GraphQL Error (Code: 504)`);

    const action = vi.fn().mockRejectedValue(originalError);

    await expect(async () => {
      await requestWithLogging(action, "someOperation");
    }).rejects.toThrow();

    expect(reportError).toHaveBeenCalledWith(originalError, {
      graphqlAPIUrl: expect.any(String),
      graphqlOperationName: "someOperation",
    });
  });
});

export {};
