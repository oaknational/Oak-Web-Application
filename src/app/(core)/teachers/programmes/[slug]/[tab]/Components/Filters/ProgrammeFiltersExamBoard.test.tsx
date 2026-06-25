import { act } from "@testing-library/react";

import {
  ProgrammeFiltersExamBoard,
  getPreservedQuery,
  shouldDisplayExamBoardFilter,
} from "./ProgrammeFiltersExamBoard";
import { ExamBoardFocusProvider, ExamBoardFocusScope } from "./ExamBoardFocus";
import { ProgrammePageFiltersModalProvider } from "./ProgrammePageFiltersModalProvider";

import { renderWithProvidersByName } from "@/__tests__/__helpers__/renderWithProviders";
import { resolveOakHref } from "@/common-lib/urls";
import { createFilter } from "@/fixtures/curriculum/filters";
import type { Ks4Option } from "@/node-lib/curriculum-api-2023/queries/curriculumPhaseOptions/curriculumPhaseOptions.schema";
import { CurriculumSelectionSlugs } from "@/utils/curriculum/slugs";

const replaceMock = jest.fn();

jest.mock("next/navigation", () => ({
  __esModule: true,
  useRouter: () => ({
    replace: replaceMock,
  }),
  useSearchParams: () => new URLSearchParams(""),
}));

const render = renderWithProvidersByName(["oakTheme", "theme"]);

const examBoardOptions: Ks4Option[] = [
  { slug: "aqa", title: "AQA" },
  { slug: "edexcel", title: "Edexcel" },
  { slug: "ocr", title: "OCR" },
];

const pathwayOptions: Ks4Option[] = [
  { slug: "core", title: "Core" },
  { slug: "gcse", title: "GCSE" },
];

const computingOptions: Ks4Option[] = [
  { slug: "core", title: "Core" },
  { slug: "aqa", title: "AQA" },
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

const ks4OptionFilterDimensions = {
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
  core: {
    tierSlugs: [],
    pathwaySlugs: ["core"],
    childSubjectSlugs: [],
  },
  gcse: {
    tierSlugs: [],
    pathwaySlugs: ["gcse"],
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

  it("returns true when ks4 options only contain pathways", () => {
    expect(
      shouldDisplayExamBoardFilter(
        { ...defaultSlugs, subjectSlug: "citizenship", ks4OptionSlug: "core" },
        defaultFilters,
        pathwayOptions,
      ),
    ).toBe(true);
  });

  it("returns true when ks4OptionSlug is a pathway slug", () => {
    expect(
      shouldDisplayExamBoardFilter(
        { ...defaultSlugs, subjectSlug: "citizenship", ks4OptionSlug: "core" },
        defaultFilters,
        pathwayOptions,
      ),
    ).toBe(true);
  });

  it("returns false when there is only one ks4 option", () => {
    expect(
      shouldDisplayExamBoardFilter(
        defaultSlugs,
        defaultFilters,
        [{ slug: "aqa", title: "AQA" }],
      ),
    ).toBe(false);
  });
});

describe("getPreservedQuery", () => {
  it("preserves compatible tiers and child subjects for the destination option", () => {
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
        ks4OptionFilterDimensions,
      ),
    ).toEqual({
      keystages: "ks4",
      years: "10",
      tiers: "foundation",
      child_subjects: "biology,chemistry",
    });
  });

  it("drops filter values that are incompatible with the destination option", () => {
    expect(
      getPreservedQuery(
        createFilter({
          keystages: ["ks4"],
          years: ["10"],
          tiers: ["higher"],
          childSubjects: ["chemistry"],
        }),
        "aqa",
        ks4OptionFilterDimensions,
      ),
    ).toEqual({
      keystages: "ks4",
      years: "10",
      tiers: undefined,
      child_subjects: undefined,
    });
  });

  it("drops dimensional filters when ks4 option filter dimensions are unavailable", () => {
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
      child_subjects: undefined,
    });
  });
});

describe("ProgrammeFiltersExamBoard", () => {
  beforeEach(() => {
    replaceMock.mockClear();
  });

  it("renders exam board options with the current board selected", () => {
    const { getAllByRole } = render(
      <ProgrammeFiltersExamBoard
        filters={defaultFilters}
        slugs={defaultSlugs}
        ks4Options={examBoardOptions}
        ks4OptionFilterDimensions={ks4OptionFilterDimensions}
      />,
    );

    const radios = getAllByRole("radio") as HTMLInputElement[];
    expect(radios).toHaveLength(3);
    expect(radios[0]).toBeChecked();
    expect(radios[0]!.value).toBe("aqa");
  });

  it("renders all ks4 options including pathways", () => {
    const { getAllByRole } = render(
      <ProgrammeFiltersExamBoard
        filters={defaultFilters}
        slugs={{
          subjectSlug: "citizenship",
          phaseSlug: "secondary",
          ks4OptionSlug: "core",
        }}
        ks4Options={pathwayOptions}
        ks4OptionFilterDimensions={ks4OptionFilterDimensions}
      />,
    );

    const radios = getAllByRole("radio") as HTMLInputElement[];
    expect(radios).toHaveLength(2);
    expect(radios.map((radio) => radio.value).sort()).toEqual(["core", "gcse"]);
    expect(radios.find((radio) => radio.value === "core")).toBeChecked();
  });

  it("navigates to the selected exam board slug and preserves KS4 query params", () => {
    const { getAllByRole } = render(
      <ProgrammeFiltersExamBoard
        filters={defaultFilters}
        slugs={defaultSlugs}
        ks4Options={examBoardOptions}
        ks4OptionFilterDimensions={ks4OptionFilterDimensions}
      />,
    );

    const radios = getAllByRole("radio") as HTMLInputElement[];

    act(() => radios[1]!.click());

    expect(replaceMock).toHaveBeenCalledWith(
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

  it("navigates from core to gcse using pathway slug", () => {
    const { getAllByRole } = render(
      <ProgrammeFiltersExamBoard
        filters={defaultFilters}
        slugs={{
          subjectSlug: "citizenship",
          phaseSlug: "secondary",
          ks4OptionSlug: "core",
        }}
        ks4Options={pathwayOptions}
        ks4OptionFilterDimensions={ks4OptionFilterDimensions}
      />,
    );

    const radios = getAllByRole("radio") as HTMLInputElement[];
    const gcseRadio = radios.find((radio) => radio.value === "gcse");

    act(() => gcseRadio!.click());

    expect(replaceMock).toHaveBeenCalledWith(
      resolveOakHref({
        page: "teacher-programme",
        subjectPhaseSlug: "citizenship-secondary-gcse",
        tab: "units",
        query: {
          keystages: "ks4",
          years: "10",
          focus_ks4option: "gcse",
        },
      }),
    );
  });

  it("navigates from core to exam board for computing", () => {
    const { getAllByRole } = render(
      <ProgrammeFiltersExamBoard
        filters={defaultFilters}
        slugs={{
          subjectSlug: "computing",
          phaseSlug: "secondary",
          ks4OptionSlug: "core",
        }}
        ks4Options={computingOptions}
        ks4OptionFilterDimensions={ks4OptionFilterDimensions}
      />,
    );

    const radios = getAllByRole("radio") as HTMLInputElement[];

    act(() => radios[2]!.click());

    expect(replaceMock).toHaveBeenCalledWith(
      resolveOakHref({
        page: "teacher-programme",
        subjectPhaseSlug: "computing-secondary-ocr",
        tab: "units",
        query: {
          keystages: "ks4",
          years: "10",
          focus_ks4option: "ocr",
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
        ks4OptionFilterDimensions={ks4OptionFilterDimensions}
      />,
    );

    const radios = getAllByRole("radio") as HTMLInputElement[];

    act(() => radios[1]!.click());

    expect(replaceMock).toHaveBeenCalledWith(
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

  it("navigates with open_filters_modal when inside modal scope", () => {
    const { getAllByRole } = render(
      <ProgrammePageFiltersModalProvider>
        <ExamBoardFocusProvider>
          <ExamBoardFocusScope variant="modal">
            <ProgrammeFiltersExamBoard
              filters={defaultFilters}
              slugs={defaultSlugs}
              ks4Options={examBoardOptions}
              ks4OptionFilterDimensions={ks4OptionFilterDimensions}
            />
          </ExamBoardFocusScope>
        </ExamBoardFocusProvider>
      </ProgrammePageFiltersModalProvider>,
    );

    const radios = getAllByRole("radio") as HTMLInputElement[];

    act(() => radios[1]!.click());

    expect(replaceMock).toHaveBeenCalledWith(
      resolveOakHref({
        page: "teacher-programme",
        subjectPhaseSlug: "english-secondary-edexcel",
        tab: "units",
        query: {
          keystages: "ks4",
          years: "10",
          focus_ks4option: "edexcel",
          open_filters_modal: "1",
        },
      }),
    );
  });

  it("renders nothing when the visibility condition is not met", () => {
    const { queryByRole } = render(
      <ProgrammeFiltersExamBoard
        filters={createFilter({ keystages: ["ks3"] })}
        slugs={{ ...defaultSlugs, ks4OptionSlug: null }}
        ks4Options={examBoardOptions}
        ks4OptionFilterDimensions={ks4OptionFilterDimensions}
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
        ks4OptionFilterDimensions={ks4OptionFilterDimensions}
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
        ks4OptionFilterDimensions={ks4OptionFilterDimensions}
      />,
    );

    expect(queryByRole("group")).not.toBeInTheDocument();
  });
});
