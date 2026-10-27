import searchPageFixture from "./fixtures/searchPage.fixture";

import curriculumApi from ".";

jest.unmock(".");

const searchPage = jest.fn(() => ({
  searchPage: [
    {
      ...searchPageFixture(),
      yearGroups: [
        ...searchPageFixture().yearGroups,
        { slug: "autumn-1", title: "Autumn 1" },
        { slug: "spring-2", title: "Spring 2" },
        { slug: "summer-1", title: "Summer 1" },
      ],
    },
  ],
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
  test("searchPage removes reception year groups", async () => {
    const res = await curriculumApi.searchPage();
    expect(res.yearGroups).toEqual(searchPageFixture().yearGroups);
  });
});
