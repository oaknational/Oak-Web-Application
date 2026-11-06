import {
  ReadonlyURLSearchParams,
  usePathname,
  useSearchParams,
} from "next/navigation";

import Search from "./Search.view";

import { getSearchFilters } from "@/context/Search/getSearchFilters";
import renderWithSeo from "@/__tests__/__helpers__/renderWithSeo";
import searchPageFixture from "@/node-lib/curriculum-api-2023/fixtures/searchPage.fixture";

const fixture = searchPageFixture();
if (!fixture) {
  throw new Error("Cannot find search page fixture");
}
const keyStages = fixture.keyStages;
const subjects = fixture.subjects;
const contentTypes = fixture.contentTypes;
const examBoards = fixture.examBoards;
const yearGroups = fixture.yearGroups;

jest.mock("next/navigation");

jest.mocked(usePathname).mockReturnValue("/");
jest
  .mocked(useSearchParams)
  .mockReturnValue(new URLSearchParams() as unknown as ReadonlyURLSearchParams);
jest.mock("posthog-js/react", () => ({
  ...jest.requireActual("posthog-js/react"),
  useFeatureFlagEnabled: () => false,
  useFeatureFlagVariantKey: () => null,
}));

describe("pages/teachers/search.tsx", () => {
  const query = { term: "test" };
  const searchFilters = getSearchFilters({
    allKeyStages: keyStages,
    allYearGroups: yearGroups,
    allSubjects: subjects,
    allContentTypes: contentTypes,
    allExamBoards: examBoards,
    query,
  });

  test("renders Search component with correct filters", () => {
    const { container } = renderWithSeo()(
      <Search
        allKeyStages={keyStages}
        results={[]}
        query={query}
        status="success"
        searchFilters={searchFilters}
      />,
    );
    expect(container).toBeInTheDocument();
  });

  test("has correct content type filters in searchFilters", () => {
    expect(searchFilters.contentTypeFilters).toHaveLength(2);
    expect(searchFilters.contentTypeFilters?.[0]?.title).toBe("Units");
    expect(searchFilters.contentTypeFilters?.[1]?.title).toBe("Lessons");
  });

  test("has correct key stage filters in searchFilters", () => {
    expect(searchFilters.keyStageFilters.length).toBeGreaterThan(0);
    const ks1 = searchFilters.keyStageFilters.find((ks) => ks.slug === "ks1");
    expect(ks1).toBeDefined();
    expect(ks1?.title).toBe("Key stage 1");
  });

  test("has correct year group filters in searchFilters", () => {
    expect(searchFilters.yearGroupFilters.length).toBeGreaterThan(0);
    const year1 = searchFilters.yearGroupFilters.find(
      (yg) => yg.slug === "year-1",
    );
    expect(year1).toBeDefined();
    expect(year1?.title).toBe("Year 1");
  });

  test("has correct examBoard filters in searchFilters", () => {
    expect(searchFilters.examBoardFilters.length).toBeGreaterThan(0);
    const aqa = searchFilters.examBoardFilters.find((eb) => eb.slug === "aqa");
    expect(aqa).toBeDefined();
    expect(aqa?.title).toBe("AQA");
  });

  test("has correct subject filters in searchFilters", () => {
    expect(searchFilters.subjectFilters.length).toBeGreaterThan(0);
    const english = searchFilters.subjectFilters.find(
      (s) => s.slug === "english",
    );
    expect(english).toBeDefined();
    expect(english?.title).toBe("English");
  });
});
