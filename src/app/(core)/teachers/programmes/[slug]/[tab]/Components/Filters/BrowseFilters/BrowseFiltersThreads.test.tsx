import { act } from "@testing-library/react";

import { BrowseFiltersThreads } from "./BrowseFiltersThreads";

import { renderWithProvidersByName } from "@/__tests__/__helpers__/renderWithProviders";
import { createThread } from "@/fixtures/curriculum/thread";
import { createUnit } from "@/fixtures/curriculum/unit";
import { CurriculumUnitsFormattedData } from "@/pages-helpers/curriculum/docx/tab-helpers";
import { useBrowseFilters } from "@/context/BrowseFilters";
import { createFilter } from "@/context/BrowseFilters/utils/fixtures";

jest.mock("@/context/BrowseFilters", () => ({
  useBrowseFilters: jest.fn(),
}));

const mockUseBrowseFilters = jest.mocked(useBrowseFilters);

const render = renderWithProvidersByName(["oakTheme", "theme"]);

const thread1 = createThread({ slug: "thread1", title: "Thread 1" });
const thread2 = createThread({ slug: "thread2", title: "Thread 2" });
const thread3 = createThread({ slug: "thread3", title: "Thread 3" });

const unitsData: CurriculumUnitsFormattedData = {
  yearData: {
    "10": {
      childSubjects: [],
      pathways: [],
      tiers: [],
      groupAs: null,
      isSwimming: false,
      nationalCurriculum: [],
      subjectCategories: [],
      units: [
        createUnit({ year: "10", threads: [thread1] }),
        createUnit({ year: "10", threads: [thread2] }),
        createUnit({ year: "10", threads: [thread3] }),
      ],
      keystage: "ks4",
    },
    "11": {
      childSubjects: [],
      pathways: [],
      tiers: [],
      groupAs: null,
      isSwimming: false,
      nationalCurriculum: [],
      subjectCategories: [],
      units: [createUnit({ year: "11", threads: [] })],
      keystage: "ks4",
    },
  },
  threadOptions: [thread1, thread2, thread3],
  yearOptions: ["10", "11"],
  keystages: ["ks4"],
};

const defaultFilters = createFilter({ years: ["10", "11"] });

const mockFns = {
  yearsForKeystage: [],
  getFilter: jest.fn(),
  setYearFilter: jest.fn(),
  setThreadFilter: jest.fn(),
  setChildSubjectFilter: jest.fn(),
  setSubjectCategoryFilter: jest.fn(),
  setTierFilter: jest.fn(),
};

describe("BrowseFiltersThreads", () => {
  it("renders the legend and all thread options", () => {
    mockUseBrowseFilters.mockReturnValue({
      filters: defaultFilters,
      onChangeFilters: () => {},
      ...mockFns,
    });
    const { getAllByRole, getByText } = render(
      <BrowseFiltersThreads data={unitsData} />,
    );

    expect(getByText("Highlight a thread")).toBeInTheDocument();

    const radios = getAllByRole("radio") as HTMLInputElement[];
    expect(radios).toHaveLength(4); // "None highlighted" + 3 threads
    expect(radios[0]!.value).toBe("");
    expect(radios[1]!.value).toBe("thread1");
    expect(radios[2]!.value).toBe("thread2");
    expect(radios[3]!.value).toBe("thread3");
  });

  it("renders 'None highlighted' option", () => {
    mockUseBrowseFilters.mockReturnValue({
      filters: defaultFilters,
      onChangeFilters: () => {},
      ...mockFns,
    });
    const { getByRole } = render(<BrowseFiltersThreads data={unitsData} />);

    expect(
      getByRole("radio", { name: /None highlighted/i }),
    ).toBeInTheDocument();
  });

  it("renders with selected thread and shows highlighted count", () => {
    mockUseBrowseFilters.mockReturnValue({
      filters: { ...defaultFilters, threads: ["thread1"] },
      onChangeFilters: () => {},
      ...mockFns,
    });
    const { getAllByRole, getByText } = render(
      <BrowseFiltersThreads data={unitsData} />,
    );

    const radios = getAllByRole("radio") as HTMLInputElement[];
    expect(radios[1]).toBeChecked();
    expect(getByText("Thread 1")).toBeInTheDocument();
    expect(getByText(/1 unit highlighted/)).toBeInTheDocument();
  });

  it("calls setThreadFilter when selecting a thread", () => {
    mockUseBrowseFilters.mockReturnValue({
      filters: defaultFilters,
      onChangeFilters: jest.fn(),
      ...mockFns,
    });
    const { getAllByRole } = render(<BrowseFiltersThreads data={unitsData} />);

    const radios = getAllByRole("radio") as HTMLInputElement[];

    act(() => radios[1]!.click());
    expect(mockFns.setThreadFilter).toHaveBeenCalledWith("thread1");
  });

  it("calls setThreadFilter with an empty value when selecting None", () => {
    mockUseBrowseFilters.mockReturnValue({
      filters: { ...defaultFilters, threads: ["thread1"] },
      onChangeFilters: jest.fn(),
      ...mockFns,
    });
    const { getAllByRole } = render(<BrowseFiltersThreads data={unitsData} />);

    const radios = getAllByRole("radio") as HTMLInputElement[];

    act(() => radios[0]!.click());
    expect(mockFns.setThreadFilter).toHaveBeenCalledWith("");
  });
});
