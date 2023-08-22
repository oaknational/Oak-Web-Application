import searchPageFixture from "./fixtures/searchPage.fixture";

import curriculumApi from ".";

jest.unmock(".");

const searchPage = jest.fn(() => ({
  searchPage: searchPageFixture(),
}));

jest.mock("./generated/sdk", () => ({
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
