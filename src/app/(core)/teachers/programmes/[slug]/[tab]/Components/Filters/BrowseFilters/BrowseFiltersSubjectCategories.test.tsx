import { act } from "@testing-library/react";

import { BrowseFiltersSubjectCategories } from "./BrowseFiltersSubjectCategories";
import { ks4Setup } from "./BrowseFiltersSubjectCategories.fixtures";

import renderWithProviders from "@/__tests__/__helpers__/renderWithProviders";
import { BrowseFiltersProvider } from "@/context/BrowseFilters";
import { BrowseFilters } from "@/context/BrowseFilters/types";
import { TeacherBrowseAnalyticsStoreProvider } from "@/context/TeacherBrowseAnalytics/TeacherBrowseAnalyticsProvider";

const defaultFilter: BrowseFilters = {
  childSubjects: [],
  subjectCategories: [],
  tiers: [],
  years: ["10", "11"],
  threads: [],
  pathways: [],
  keystages: [],
};

const slugs = {
  subjectSlug: "english" as const,
  phaseSlug: "secondary" as const,
  ks4OptionSlug: null,
};

const renderWithStore = (
  ui: React.ReactElement,
  filter: BrowseFilters = defaultFilter,
) =>
  renderWithProviders()(
    <TeacherBrowseAnalyticsStoreProvider
      programmeState={null}
      accessLevel="programme"
    >
      <BrowseFiltersProvider defaultFilter={filter}>{ui}</BrowseFiltersProvider>
    </TeacherBrowseAnalyticsStoreProvider>,
  );

describe("BrowseFiltersSubjectCategories", () => {
  it("renders correctly", () => {
    const { getAllByRole } = renderWithStore(
      <BrowseFiltersSubjectCategories data={ks4Setup} slugs={slugs} />,
    );

    const elements = getAllByRole("radio") as HTMLInputElement[];
    expect(elements).toHaveLength(3);
    expect(elements[0]!.value).toEqual("biology");
    expect(elements[1]!.value).toEqual("chemistry");
    expect(elements[2]!.value).toEqual("physics");
  });

  it("interacts correctly", () => {
    const { getAllByRole } = renderWithStore(
      <BrowseFiltersSubjectCategories data={ks4Setup} slugs={slugs} />,
    );

    const elements = getAllByRole("radio") as HTMLInputElement[];

    act(() => elements[0]!.click());
    expect(elements[0]!.checked).toBe(true);
  });
});
