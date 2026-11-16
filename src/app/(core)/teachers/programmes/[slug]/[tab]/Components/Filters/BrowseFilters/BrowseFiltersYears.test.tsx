import { act } from "@testing-library/react";

import { BrowseFiltersYears } from "./BrowseFiltersYears";

import { basicSetup } from "@/components/CurriculumComponents/CurricVisualiserFilters/CurricFiltersYears.fixtures";
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

describe("BrowseFiltersYears", () => {
  it("renders correctly, without Core/GCSE duplication", () => {
    const { getAllByRole } = renderWithStore(
      <BrowseFiltersYears data={basicSetup} />,
    );

    const radios = getAllByRole("radio");
    expect(radios).toHaveLength(3);
    expect(radios[0]).toHaveAccessibleName("All");
    expect(radios[1]).toHaveAccessibleName("Year 10");
    expect(radios[2]).toHaveAccessibleName("Year 11");
  });

  it("interacts correctly", () => {
    const { getAllByRole } = renderWithStore(
      <BrowseFiltersYears data={basicSetup} />,
    );

    const elements = getAllByRole("radio") as HTMLInputElement[];
    expect(elements).toHaveLength(3);

    // 10
    act(() => elements[1]!.click());
    expect(elements[1]!.checked).toBe(true);

    // 11
    act(() => elements[2]!.click());
    expect(elements[2]!.checked).toBe(true);

    // All
    act(() => elements[0]!.click());
    expect(elements[0]!.checked).toBe(true);
  });

  it("renders the tablet 'All filters' button when onModalOpen is provided", () => {
    const onModalOpen = jest.fn();
    const { getByTestId } = renderWithStore(
      <BrowseFiltersYears data={basicSetup} onModalOpen={onModalOpen} />,
    );

    act(() => getByTestId("tablet-all-filters").click());
    expect(onModalOpen).toHaveBeenCalled();
  });

  it("moves focus from All to the selected year", () => {
    const { getByRole } = renderWithStore(
      <BrowseFiltersYears data={basicSetup} />,
    );

    const all = getByRole("radio", { name: "All" });
    const year10 = getByRole("radio", { name: "Year 10" });
    const year11 = getByRole("radio", { name: "Year 11" });

    all.focus();
    expect(all).toHaveFocus();
    act(() => year10.click());
    expect(year10).toBeChecked();
    expect(year10).toHaveFocus();
    expect(all).not.toHaveFocus();
    act(() => year11.click());
    expect(year11).toBeChecked();
    expect(year11).toHaveFocus();
    expect(year10).not.toHaveFocus();
  });
});
