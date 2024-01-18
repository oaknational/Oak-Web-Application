import { describe, expect, it, vi } from "vitest";

import mocks from "./__mocks__";

import curriculumApi from ".";

vi.mock(".", async () => ({ default: (await vi.importActual(".")).default }));
vi.mock("./generated/sdk", () => ({
  __esModule: true,
  getSdk: () => ({
    searchPage: async () => {
      const res = await mocks.searchPage();
      return { searchPage: [res] };
    },
  }),
}));

describe("curriculum-api", () => {
  it("searchPage", async () => {
    await curriculumApi.searchPage();
    expect(mocks.searchPage).toHaveBeenCalled();
  });
});
