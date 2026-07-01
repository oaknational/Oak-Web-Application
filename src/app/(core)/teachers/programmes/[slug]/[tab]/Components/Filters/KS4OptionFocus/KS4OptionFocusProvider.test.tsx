import { act, waitFor } from "@testing-library/react";
import type { ReactElement } from "react";
import React from "react";

import { ProgrammeFiltersKs4Options } from "../ProgrammeFiltersKs4Options";
import {
  ProgrammePageFiltersModalProvider,
  useProgrammePageFiltersModal,
} from "../ProgrammePageFiltersModalProvider";

import {
  FOCUS_KS4_OPTION_QUERY_PARAM,
  OPEN_FILTERS_MODAL_QUERY_PARAM,
} from "./ks4OptionFocusParams";

import { KS4OptionFocusProvider, KS4OptionFocusScope } from "./index";

import { renderWithProvidersByName } from "@/__tests__/__helpers__/renderWithProviders";
import { createFilter } from "@/fixtures/curriculum/filters";
import type { Ks4Option } from "@/node-lib/curriculum-api-2023/queries/curriculumPhaseOptions/curriculumPhaseOptions.schema";
import { CurriculumSelectionSlugs } from "@/utils/curriculum/slugs";

const useSearchParamsMock = jest.fn();
const replaceStateMock = jest.fn();

jest.mock("next/navigation", () => ({
  __esModule: true,
  useRouter: () => ({
    push: jest.fn(),
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
  ks4OptionSlug: "ocr",
};

const defaultFilters = createFilter({
  keystages: ["ks4"],
  years: ["10"],
});

const ks4OptionFilterDimensions = {
  ocr: {
    tierSlugs: ["foundation"],
    pathwaySlugs: [],
    childSubjectSlugs: [],
  },
};

function renderWithProviders(ui: ReactElement) {
  return render(
    <ProgrammePageFiltersModalProvider>
      <KS4OptionFocusProvider>{ui}</KS4OptionFocusProvider>
    </ProgrammePageFiltersModalProvider>,
  );
}

function renderWithFocusScope(
  variant: "page" | "modal",
  searchParams: URLSearchParams,
) {
  useSearchParamsMock.mockReturnValue(searchParams);

  return renderWithProviders(
    <KS4OptionFocusScope variant={variant}>
      <ProgrammeFiltersKs4Options
        filters={defaultFilters}
        slugs={defaultSlugs}
        ks4Options={examBoardOptions}
        ks4OptionFilterDimensions={ks4OptionFilterDimensions}
      />
    </KS4OptionFocusScope>,
  );
}

describe("KS4OptionFocusProvider", () => {
  beforeEach(() => {
    replaceStateMock.mockClear();
    useSearchParamsMock.mockReturnValue(new URLSearchParams(""));
  });

  it("focuses the matching KS4 option radio on page and strips focus_ks4option", async () => {
    const focusSpy = jest.spyOn(HTMLInputElement.prototype, "focus");

    const { getAllByRole } = renderWithFocusScope(
      "page",
      new URLSearchParams(
        `keystages=ks4&years=10&${FOCUS_KS4_OPTION_QUERY_PARAM}=ocr`,
      ),
    );

    const radios = getAllByRole("radio") as HTMLInputElement[];
    const ocrRadio = radios.find((radio) => radio.value === "ocr");

    await waitFor(() => {
      expect(focusSpy).toHaveBeenCalled();
      expect(focusSpy.mock.instances[0]).toBe(ocrRadio);
      expect(replaceStateMock).toHaveBeenCalledWith(
        null,
        "",
        "/teachers/programmes/english-secondary-ocr/units?keystages=ks4&years=10",
      );
    });

    focusSpy.mockRestore();
  });

  it("strips focus_ks4option without focusing when the slug is invalid", async () => {
    const focusSpy = jest.spyOn(HTMLInputElement.prototype, "focus");

    renderWithFocusScope(
      "page",
      new URLSearchParams(`${FOCUS_KS4_OPTION_QUERY_PARAM}=invalid-board`),
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

  it("does not focus on page scope when open_filters_modal is present", async () => {
    const focusSpy = jest.spyOn(HTMLInputElement.prototype, "focus");

    renderWithFocusScope(
      "page",
      new URLSearchParams(
        `${FOCUS_KS4_OPTION_QUERY_PARAM}=ocr&${OPEN_FILTERS_MODAL_QUERY_PARAM}=1`,
      ),
    );

    await act(async () => {
      await new Promise<void>((resolve) => {
        requestAnimationFrame(() => resolve());
      });
    });

    expect(focusSpy).not.toHaveBeenCalled();
    expect(replaceStateMock).not.toHaveBeenCalled();

    focusSpy.mockRestore();
  });

  it("focuses in modal scope after mobile modal opens and strips both ephemeral params", async () => {
    useSearchParamsMock.mockReturnValue(
      new URLSearchParams(
        `keystages=ks4&${FOCUS_KS4_OPTION_QUERY_PARAM}=ocr&${OPEN_FILTERS_MODAL_QUERY_PARAM}=1`,
      ),
    );

    const focusSpy = jest.spyOn(HTMLInputElement.prototype, "focus");

    const ModalHarness = () => {
      const { isOpen } = useProgrammePageFiltersModal();

      return (
        <>
          <span data-testid="modal-open">{String(isOpen)}</span>
          {isOpen && (
            <KS4OptionFocusScope variant="modal">
              <ProgrammeFiltersKs4Options
                filters={defaultFilters}
                slugs={defaultSlugs}
                ks4Options={examBoardOptions}
                ks4OptionFilterDimensions={ks4OptionFilterDimensions}
              />
            </KS4OptionFocusScope>
          )}
        </>
      );
    };

    const { getByTestId, getAllByRole } = renderWithProviders(<ModalHarness />);

    await waitFor(() => {
      expect(getByTestId("modal-open")).toHaveTextContent("true");
    });

    const radios = getAllByRole("radio") as HTMLInputElement[];
    const ocrRadio = radios.find((radio) => radio.value === "ocr");

    await waitFor(() => {
      expect(focusSpy).toHaveBeenCalled();
      expect(focusSpy.mock.instances).toContain(ocrRadio);
      expect(replaceStateMock).toHaveBeenCalledWith(
        null,
        "",
        "/teachers/programmes/english-secondary-ocr/units?keystages=ks4",
      );
    });

    focusSpy.mockRestore();
  });
});
