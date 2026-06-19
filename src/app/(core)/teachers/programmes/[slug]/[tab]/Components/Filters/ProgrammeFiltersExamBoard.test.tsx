import { act, waitFor } from "@testing-library/react";

import {
  FOCUS_KS4_OPTION_QUERY_PARAM,
  ProgrammeFiltersExamBoard,
  getPreservedQuery,
  shouldDisplayExamBoardFilter,
} from "./ProgrammeFiltersExamBoard";

import { renderWithProvidersByName } from "@/__tests__/__helpers__/renderWithProviders";
import { resolveOakHref } from "@/common-lib/urls";
import { createFilter } from "@/fixtures/curriculum/filters";
import type { Ks4Option } from "@/node-lib/curriculum-api-2023/queries/curriculumPhaseOptions/curriculumPhaseOptions.schema";
import { CurriculumSelectionSlugs } from "@/utils/curriculum/slugs";

const pushMock = jest.fn();
const useSearchParamsMock = jest.fn();
const replaceStateMock = jest.fn();

jest.mock("next/navigation", () => ({
  __esModule: true,
  useRouter: () => ({
    push: pushMock,
  }),
  useSearchParams: () => useSearchParamsMock(),
}));

Object.defineProperty(globalThis, "history", {
  value: {
    replaceState: replaceStateMock,
  },
  writable: true,
});

Object.defineProperty(globalThis, "location", {
  value: {
    pathname: "/teachers/programmes/english-secondary-ocr/units",
  },
  writable: true,
});

const render = renderWithProvidersByName(["oakTheme", "theme"]);

const examBoardOptions: Ks4Option[] = [
  { slug: "aqa", title: "AQA" },
  { slug: "edexcel", title: "Edexcel" },
  { slug: "ocr", title: "OCR" },
];

const defaultSlugs: CurriculumSelectionSlugs = {
  subjectSlug: "english",
  phaseSlug: "secondary",
  ks4OptionSlug: "aqa",
};

const defaultFilters = createFilter({
  keystages: ["ks4"],
  years: ["10"],
});

const examboardFilterDimensions = {
  aqa: {
    tierSlugs: ["foundation"],
    pathwaySlugs: [],
    childSubjectSlugs: ["biology"],
  },
  edexcel: {
    tierSlugs: ["foundation", "higher"],
    pathwaySlugs: ["gcse"],
    childSubjectSlugs: ["biology", "chemistry"],
  },
  ocr: {
    tierSlugs: ["foundation"],
    pathwaySlugs: [],
    childSubjectSlugs: [],
  },
};

describe("shouldDisplayExamBoardFilter", () => {
  it("returns true for secondary KS4 context with exam board options", () => {
    expect(
      shouldDisplayExamBoardFilter(
        defaultSlugs,
        defaultFilters,
        examBoardOptions,
      ),
    ).toBe(true);
  });

  it("returns false when keystages filter includes ks4 but slug has no ks4 option", () => {
    expect(
      shouldDisplayExamBoardFilter(
        { ...defaultSlugs, ks4OptionSlug: null },
        createFilter({ keystages: ["ks4"] }),
        examBoardOptions,
      ),
    ).toBe(false);
  });

  it("returns false for primary phase", () => {
    expect(
      shouldDisplayExamBoardFilter(
        { ...defaultSlugs, phaseSlug: "primary" },
        defaultFilters,
        examBoardOptions,
      ),
    ).toBe(false);
  });

  it("returns false when not in KS4 context", () => {
    expect(
      shouldDisplayExamBoardFilter(
        { ...defaultSlugs, ks4OptionSlug: null },
        createFilter({ keystages: ["ks3"] }),
        examBoardOptions,
      ),
    ).toBe(false);
  });

  it("returns false when keystages filter includes ks3 even on an exam board slug", () => {
    expect(
      shouldDisplayExamBoardFilter(
        defaultSlugs,
        createFilter({ keystages: ["ks3"] }),
        examBoardOptions,
      ),
    ).toBe(false);
  });

  it("returns false when keystages filter is ks3 with all years selected", () => {
    expect(
      shouldDisplayExamBoardFilter(
        defaultSlugs,
        createFilter({
          keystages: ["ks3"],
          years: ["7", "8", "9", "10", "11"],
        }),
        examBoardOptions,
      ),
    ).toBe(false);
  });

  it("returns true when keystages filter includes both ks3 and ks4", () => {
    expect(
      shouldDisplayExamBoardFilter(
        defaultSlugs,
        createFilter({
          keystages: ["ks3", "ks4"],
          years: ["7", "8", "9", "10", "11"],
        }),
        examBoardOptions,
      ),
    ).toBe(true);
  });

  it("returns true when filtered to a KS4 year even with ks3 keystage", () => {
    expect(
      shouldDisplayExamBoardFilter(
        defaultSlugs,
        createFilter({ keystages: ["ks3"], years: ["10"] }),
        examBoardOptions,
      ),
    ).toBe(true);
  });

  it("returns false when filtered to a non-KS4 year on an exam board slug", () => {
    expect(
      shouldDisplayExamBoardFilter(
        defaultSlugs,
        createFilter({ years: ["7"] }),
        examBoardOptions,
      ),
    ).toBe(false);
  });

  it("returns false when ks4 options only contain pathways", () => {
    expect(
      shouldDisplayExamBoardFilter(defaultSlugs, defaultFilters, [
        { slug: "gcse", title: "GCSE" },
        { slug: "core", title: "Core" },
      ]),
    ).toBe(false);
  });

  it("returns false when ks4OptionSlug is a pathway rather than an exam board", () => {
    expect(
      shouldDisplayExamBoardFilter(
        { ...defaultSlugs, ks4OptionSlug: "core" },
        defaultFilters,
        examBoardOptions,
      ),
    ).toBe(false);
  });
});

describe("getPreservedQuery", () => {
  it("preserves compatible tiers, pathways, and child subjects for the destination board", () => {
    expect(
      getPreservedQuery(
        createFilter({
          keystages: ["ks4"],
          years: ["10"],
          tiers: ["foundation"],
          pathways: ["gcse"],
          childSubjects: ["biology", "chemistry"],
        }),
        "edexcel",
        examboardFilterDimensions,
      ),
    ).toEqual({
      keystages: "ks4",
      years: "10",
      tiers: "foundation",
      pathways: "gcse",
      child_subjects: "biology,chemistry",
    });
  });

  it("drops filter values that are incompatible with the destination board", () => {
    expect(
      getPreservedQuery(
        createFilter({
          keystages: ["ks4"],
          years: ["10"],
          tiers: ["higher"],
          childSubjects: ["chemistry"],
        }),
        "aqa",
        examboardFilterDimensions,
      ),
    ).toEqual({
      keystages: "ks4",
      years: "10",
      tiers: undefined,
      pathways: undefined,
      child_subjects: undefined,
    });
  });

  it("drops dimensional filters when examboard filter dimensions are unavailable", () => {
    expect(
      getPreservedQuery(
        createFilter({
          keystages: ["ks4"],
          years: ["10"],
          tiers: ["higher"],
          childSubjects: ["chemistry"],
        }),
        "edexcel",
      ),
    ).toEqual({
      keystages: "ks4",
      years: "10",
      tiers: undefined,
      pathways: undefined,
      child_subjects: undefined,
    });
  });
});

describe("ProgrammeFiltersExamBoard", () => {
  beforeEach(() => {
    pushMock.mockClear();
    replaceStateMock.mockClear();
    useSearchParamsMock.mockReturnValue(new URLSearchParams(""));
  });

  it("renders exam board options with the current board selected", () => {
    const { getAllByRole } = render(
      <ProgrammeFiltersExamBoard
        filters={defaultFilters}
        slugs={defaultSlugs}
        ks4Options={examBoardOptions}
        examboardFilterDimensions={examboardFilterDimensions}
      />,
    );

    const radios = getAllByRole("radio") as HTMLInputElement[];
    expect(radios).toHaveLength(3);
    expect(radios[0]).toBeChecked();
    expect(radios[0]!.value).toBe("aqa");
  });

  it("navigates to the selected exam board slug and preserves KS4 query params", () => {
    const { getAllByRole } = render(
      <ProgrammeFiltersExamBoard
        filters={defaultFilters}
        slugs={defaultSlugs}
        ks4Options={examBoardOptions}
        examboardFilterDimensions={examboardFilterDimensions}
      />,
    );

    const radios = getAllByRole("radio") as HTMLInputElement[];

    act(() => radios[1]!.click());

    expect(pushMock).toHaveBeenCalledWith(
      resolveOakHref({
        page: "teacher-programme",
        subjectPhaseSlug: "english-secondary-edexcel",
        tab: "units",
        query: {
          keystages: "ks4",
          years: "10",
          focus_ks4option: "edexcel",
        },
      }),
    );
  });

  it("drops non-KS4 years from the preserved query params", () => {
    const { getAllByRole } = render(
      <ProgrammeFiltersExamBoard
        filters={createFilter({ keystages: ["ks4"], years: ["7", "10"] })}
        slugs={defaultSlugs}
        ks4Options={examBoardOptions}
        examboardFilterDimensions={examboardFilterDimensions}
      />,
    );

    const radios = getAllByRole("radio") as HTMLInputElement[];

    act(() => radios[1]!.click());

    expect(pushMock).toHaveBeenCalledWith(
      resolveOakHref({
        page: "teacher-programme",
        subjectPhaseSlug: "english-secondary-edexcel",
        tab: "units",
        query: {
          keystages: "ks4",
          focus_ks4option: "edexcel",
        },
      }),
    );
  });

  it("focuses the matching exam board radio when focus_ks4option is present", async () => {
    useSearchParamsMock.mockReturnValue(
      new URLSearchParams(`${FOCUS_KS4_OPTION_QUERY_PARAM}=ocr`),
    );

    const focusSpy = jest.spyOn(HTMLInputElement.prototype, "focus");

    const { getAllByRole } = render(
      <ProgrammeFiltersExamBoard
        filters={defaultFilters}
        slugs={{ ...defaultSlugs, ks4OptionSlug: "ocr" }}
        ks4Options={examBoardOptions}
        examboardFilterDimensions={examboardFilterDimensions}
      />,
    );

    const radios = getAllByRole("radio") as HTMLInputElement[];
    const ocrRadio = radios.find((radio) => radio.value === "ocr");

    await waitFor(() => {
      expect(focusSpy).toHaveBeenCalled();
      expect(ocrRadio).toBeDefined();
      expect(focusSpy.mock.instances[0]).toBe(ocrRadio);
    });

    focusSpy.mockRestore();
  });

  it("strips focus_ks4option from the URL after focusing", async () => {
    useSearchParamsMock.mockReturnValue(
      new URLSearchParams(
        `keystages=ks4&years=10&${FOCUS_KS4_OPTION_QUERY_PARAM}=ocr`,
      ),
    );

    render(
      <ProgrammeFiltersExamBoard
        filters={defaultFilters}
        slugs={{ ...defaultSlugs, ks4OptionSlug: "ocr" }}
        ks4Options={examBoardOptions}
        examboardFilterDimensions={examboardFilterDimensions}
      />,
    );

    await waitFor(() => {
      expect(replaceStateMock).toHaveBeenCalledWith(
        null,
        "",
        "/teachers/programmes/english-secondary-ocr/units?keystages=ks4&years=10",
      );
    });
  });

  it("strips focus_ks4option without focusing when the slug is invalid", async () => {
    useSearchParamsMock.mockReturnValue(
      new URLSearchParams(`${FOCUS_KS4_OPTION_QUERY_PARAM}=invalid-board`),
    );

    const focusSpy = jest.spyOn(HTMLInputElement.prototype, "focus");

    render(
      <ProgrammeFiltersExamBoard
        filters={defaultFilters}
        slugs={defaultSlugs}
        ks4Options={examBoardOptions}
        examboardFilterDimensions={examboardFilterDimensions}
      />,
    );

    await waitFor(() => {
      expect(replaceStateMock).toHaveBeenCalledWith(
        null,
        "",
        "/teachers/programmes/english-secondary-ocr/units",
      );
    });

    expect(focusSpy).not.toHaveBeenCalled();

    focusSpy.mockRestore();
  });

  it("renders nothing when the visibility condition is not met", () => {
    const { queryByRole } = render(
      <ProgrammeFiltersExamBoard
        filters={createFilter({ keystages: ["ks3"] })}
        slugs={{ ...defaultSlugs, ks4OptionSlug: null }}
        ks4Options={examBoardOptions}
        examboardFilterDimensions={examboardFilterDimensions}
      />,
    );

    expect(queryByRole("group")).not.toBeInTheDocument();
  });

  it("renders nothing when filtered to ks3 on an exam board slug", () => {
    const { queryByRole } = render(
      <ProgrammeFiltersExamBoard
        filters={createFilter({ keystages: ["ks3"] })}
        slugs={defaultSlugs}
        ks4Options={examBoardOptions}
        examboardFilterDimensions={examboardFilterDimensions}
      />,
    );

    expect(queryByRole("group")).not.toBeInTheDocument();
  });

  it("renders nothing when filtered to a non-KS4 year on an exam board slug", () => {
    const { queryByRole } = render(
      <ProgrammeFiltersExamBoard
        filters={createFilter({ years: ["7"] })}
        slugs={defaultSlugs}
        ks4Options={examBoardOptions}
        examboardFilterDimensions={examboardFilterDimensions}
      />,
    );

    expect(queryByRole("group")).not.toBeInTheDocument();
  });
});
