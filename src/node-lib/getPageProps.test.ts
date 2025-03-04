import OakError from "../errors/OakError";

import getPageProps from "./getPageProps";

jest.mock("../common-lib/error-reporter", () => ({
  initialiseBugsnag: jest.fn(),
}));
jest.mock("./isr", () => ({
  decorateWithIsr: jest.fn((results) => ({ ...results, revalidate: 1337 })),
}));

describe("getPageProps()", () => {
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
