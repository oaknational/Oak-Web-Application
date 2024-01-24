import { beforeEach, describe, expect, it, vi } from "vitest";

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

const { reportError } = vi.hoisted(() => ({
  reportError: vi.fn(),
}));
vi.mock("@/common-lib/error-reporter/errorReporter", () => ({
  __esModule: true,
  default: () => reportError,
}));
vi.mock("./generated/sdk", () => ({
  getSdk: vi.fn(() => "the sdk"),
}));
vi.doMock("../getServerConfig", () => ({
  __esModule: true,
  default: configGetSpy,
}));
const GraphQLClientSpy = vi.fn();
vi.doMock("graphql-request", () => ({
  GraphQLClient: GraphQLClientSpy,
}));

describe("node-lib/sanity-graphql/index.ts", () => {
  beforeEach(() => {
    vi.resetModules();
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
