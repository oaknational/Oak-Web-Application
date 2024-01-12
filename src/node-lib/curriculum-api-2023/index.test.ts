import searchPageFixture from "./fixtures/searchPage.fixture";

import curriculumApi from ".";

jest.unmock(".");

const searchPage = vi.fn(() => ({
  searchPage: searchPageFixture(),
}));

vi.mock("./generated/sdk", () => ({
  __esModule: true,
  getSdk: () => ({
    searchPage: (...args: []) => searchPage(...args),
  }),
}));

describe("curriculum-api", () => {
  test("searchPage", async () => {
    await curriculumApi.searchPage();
    expect(searchPage).toHaveBeenCalled();
  });
});
