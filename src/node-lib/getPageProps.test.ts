import OakError from "../errors/OakError";

import getPageProps from "./getPageProps";

import {
  initialiseBugsnag,
  initialiseSentry,
} from "@/common-lib/error-reporter";

jest.mock("../common-lib/error-reporter", () => ({
  initialiseBugsnag: jest.fn(),
  initialiseSentry: jest.fn(),
}));
jest.mock("./isr", () => ({
  decorateWithIsr: jest.fn((results) => ({ ...results, revalidate: 1337 })),
}));

describe("getPageProps()", () => {
  it("should initialize bugsnag when sentry is NOT enabled", async () => {
    jest.clearAllMocks();
    await jest.isolateModulesAsync(async () => {
      jest.mock("@/browser-lib/getBrowserConfig", () => {
        return {
          __esModule: true,
          default: () => "false",
        };
      });
      await import("./getPageProps");
      expect(initialiseBugsnag).toHaveBeenCalled();
      expect(initialiseSentry).not.toHaveBeenCalled();
    });
  });

  it("should initialize sentry when enabled", async () => {
    jest.clearAllMocks();
    await jest.isolateModulesAsync(async () => {
      jest.mock("@/browser-lib/getBrowserConfig", () => {
        return {
          __esModule: true,
          default: () => "true",
        };
      });
      await import("./getPageProps");
      expect(initialiseBugsnag).not.toHaveBeenCalled();
      expect(initialiseSentry).toHaveBeenCalled();
    });
  });

  it("should return a promise resolving to value of getProps()", async () => {
    const results = await getPageProps({
      page: "test",
      context: {},
      getProps: async () => ({ props: "test props" }),
    });
    expect(results).toMatchObject({ props: "test props" });
  });
  it("should add ISR config", async () => {
    const results = await getPageProps({
      page: "test",
      context: {},
      getProps: async () => ({ props: "test props" }),
    });
    expect(results).toMatchObject({ revalidate: 1337 });
  });
  it("should return notFound if OakError with 404 status code is thrown", async () => {
    const results = await getPageProps({
      page: "test",
      context: {},
      getProps: async () => {
        throw new OakError({ code: "curriculum-api/not-found" });
      },
    });
    expect(results).toEqual({ notFound: true });
  });
  it("should throw error if OakError with non-404 status code is thrown", async () => {
    await expect(
      getPageProps({
        page: "test",
        context: {},
        getProps: async () => {
          throw new OakError({ code: "misc/unknown" });
        },
      }),
    ).rejects.toThrow();
  });
});
