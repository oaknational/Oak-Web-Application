import topNavQuery from "./topNav.query";
import { mockResponseData } from "./fixtures";

import sdk from "@/node-lib/curriculum-api-2023/sdk";
import OakError from "@/errors/OakError";

jest.mock("@/node-lib/curriculum-api-2023/sdk", () => {});

const mockErrorReporter = jest.fn();
jest.mock("@/common-lib/error-reporter", () => ({
  __esModule: true,
  default:
    () =>
    (...args: []) =>
      mockErrorReporter(...args),
}));

describe("TopNavQuery", () => {
  it("returns the correct data", async () => {
    const res = await topNavQuery({
      ...sdk,
      topNav: jest.fn(() => Promise.resolve(mockResponseData)),
    })();

    expect(res.teachers?.primary.keystages).toHaveLength(3);
    expect(res.teachers?.secondary.keystages).toHaveLength(2);
    expect(res.pupils?.primary.years).toHaveLength(3);
    expect(res.pupils?.secondary.years).toHaveLength(1);
  });
  it("reports an error when data is missing", async () => {
    await topNavQuery({
      ...sdk,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      topNav: jest.fn(() => Promise.resolve({ invalidData: [] }) as any),
    })();

    expect(mockErrorReporter).toHaveBeenCalledWith(
      new OakError({
        code: "curriculum-api/internal-error",
      }),
      {
        severity: "error",
        res: { invalidData: [] },
        errorMessage: expect.any(Object),
      },
    );
  });
  it("does not throw an error when data is missing", async () => {
    const res = await topNavQuery({
      ...sdk,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      topNav: jest.fn(() => Promise.resolve({ invalidData: [] }) as any),
    })();

    expect(res).toBeDefined();
  });
});
