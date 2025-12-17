import topNavQuery from "./topNav.query";
import { mockResponseData } from "./fixtures";

import sdk from "@/node-lib/curriculum-api-2023/sdk";

jest.mock("@/node-lib/curriculum-api-2023/sdk", () => {});

describe("TopNavQuery", () => {
  it("returns the correct data", async () => {
    const res = await topNavQuery({
      ...sdk,
      topNav: jest.fn(() => Promise.resolve(mockResponseData)),
    })();

    expect(res.teachers.primary.keystages).toHaveLength(3);
    expect(res.teachers.secondary.keystages).toHaveLength(2);
    expect(res.pupils.primary.years).toHaveLength(1);
    expect(res.pupils.secondary.years).toHaveLength(1);
  });
});
