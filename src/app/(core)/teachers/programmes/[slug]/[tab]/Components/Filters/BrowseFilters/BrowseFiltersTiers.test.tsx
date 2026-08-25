import { act } from "@testing-library/react";

import { BrowseFiltersTiers } from "./BrowseFiltersTiers";
import { ks4Setup } from "./BrowseFiltersTiers.fixtures";

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

describe("BrowseFiltersTiers", () => {
  it("renders correctly", () => {
    const { getAllByRole } = renderWithStore(
      <BrowseFiltersTiers data={ks4Setup} />,
    );

    const elements = getAllByRole("radio") as HTMLInputElement[];
    expect(elements).toHaveLength(2);
    expect(elements[0]!.value).toEqual("foundation");
    expect(elements[1]!.value).toEqual("higher");
  });

  it("interacts correctly", () => {
    const { getAllByRole } = renderWithStore(
      <BrowseFiltersTiers data={ks4Setup} />,
    );

    const elements = getAllByRole("radio") as HTMLInputElement[];

    act(() => elements[0]!.click());
    expect(elements[0]!.checked).toBe(true);

    act(() => elements[1]!.click());
    expect(elements[1]!.checked).toBe(true);
  });
});
