import { describe, expect, it } from "vitest";

import mocks from "./__mocks__";

import curriculumApi from ".";

vi.mock(".", async () => ({ default: (await vi.importActual(".")).default }));
vi.mock("./generated/sdk", () => ({
  __esModule: true,
  getSdk: () => ({
    searchPage: mocks.searchPage,
  }),
}));

describe("curriculum-api", () => {
  it("searchPage", async () => {
    await curriculumApi.searchPage();
    expect(mocks.searchPage).toHaveBeenCalled();
  });
});
