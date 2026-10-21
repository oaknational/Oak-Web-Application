import { fireEvent, render, waitFor } from "@testing-library/react";
import { StrictMode } from "react";

import {
  ProgrammeNavigationProvider,
  useProgrammeNavigation,
} from "../../../../../ProgrammeNavigationProvider";
import {
  ProgrammePageFiltersModalProvider,
  useProgrammePageFiltersModal,
} from "../ProgrammePageFiltersModalProvider";

import { KS4OptionFocusProvider, KS4OptionFocusScope } from "./index";

import type { CurriculumSelectionSlugs } from "@/utils/curriculum/slugs";

let mockPathname = "/teachers/programmes/english-secondary-aqa/units";
jest.mock("next/navigation", () => ({
  usePathname: () => mockPathname,
}));

const source: CurriculumSelectionSlugs = {
  subjectSlug: "english",
  phaseSlug: "secondary",
  ks4OptionSlug: "aqa",
};
const destination = { ...source, ks4OptionSlug: "ocr" };
const destinationPath = "/teachers/programmes/english-secondary-ocr/units";

function NavigationButton({
  keyboard,
  modal,
}: {
  keyboard: boolean;
  modal: boolean;
}) {
  const { setNavigationIntent } = useProgrammeNavigation();
  return (
    <button
      onClick={() =>
        setNavigationIntent({
          destination,
          restoreFocus: keyboard,
          reopenFiltersModal: modal,
        })
      }
    >
      Navigate
    </button>
  );
}

function Radios() {
  const { isOpen } = useProgrammePageFiltersModal();
  return (
    <>
      <span data-testid="modal-open">{String(isOpen)}</span>
      <KS4OptionFocusScope variant="page">
        <input type="radio" value="ocr" aria-label="Page OCR" />
      </KS4OptionFocusScope>
      {isOpen && (
        <KS4OptionFocusScope variant="modal">
          <input type="radio" value="ocr" aria-label="Modal OCR" />
        </KS4OptionFocusScope>
      )}
    </>
  );
}

function Harness({
  slugs = source,
  pageKey = "source",
  keyboard = true,
  modal = false,
}: {
  slugs?: CurriculumSelectionSlugs;
  pageKey?: string;
  keyboard?: boolean;
  modal?: boolean;
}) {
  return (
    <StrictMode>
      <ProgrammeNavigationProvider>
        <NavigationButton keyboard={keyboard} modal={modal} />
        <ProgrammePageFiltersModalProvider key={pageKey}>
          <KS4OptionFocusProvider slugs={slugs}>
            <Radios />
          </KS4OptionFocusProvider>
        </ProgrammePageFiltersModalProvider>
      </ProgrammeNavigationProvider>
    </StrictMode>
  );
}

describe("KS4 navigation intent", () => {
  beforeEach(() => {
    mockPathname = "/teachers/programmes/english-secondary-aqa/units";
  });

  it.each([
    { keyboard: true, modal: false },
    { keyboard: false, modal: false },
    { keyboard: true, modal: true },
    { keyboard: false, modal: true },
  ])(
    "restores one-time intent across a page remount (keyboard: $keyboard, modal: $modal)",
    async ({ keyboard, modal }) => {
      const focusSpy = jest.spyOn(HTMLInputElement.prototype, "focus");
      const { getByRole, getByTestId, rerender } = render(
        <Harness keyboard={keyboard} modal={modal} />,
      );
      fireEvent.click(getByRole("button", { name: "Navigate" }));
      expect(focusSpy).not.toHaveBeenCalled();
      expect(getByTestId("modal-open")).toHaveTextContent("false");

      mockPathname = destinationPath;
      rerender(<Harness slugs={destination} pageKey="destination" />);
      await waitFor(() => {
        expect(getByTestId("modal-open")).toHaveTextContent(String(modal));
        if (keyboard) {
          expect(
            getByRole("radio", { name: modal ? "Modal OCR" : "Page OCR" }),
          ).toHaveFocus();
          expect(focusSpy).toHaveBeenCalledWith({ preventScroll: true });
        }
      });
      if (!keyboard) {
        expect(focusSpy).not.toHaveBeenCalled();
      }

      focusSpy.mockClear();
      rerender(<Harness slugs={destination} pageKey="revisit" />);
      expect(getByTestId("modal-open")).toHaveTextContent("false");
      expect(focusSpy).not.toHaveBeenCalled();
      focusSpy.mockRestore();
    },
  );

  it("does not restore intent on direct visits or refresh", () => {
    mockPathname = destinationPath;
    const focusSpy = jest.spyOn(HTMLInputElement.prototype, "focus");
    const { getByTestId } = render(
      <Harness slugs={destination} pageKey="direct" />,
    );
    expect(getByTestId("modal-open")).toHaveTextContent("false");
    expect(focusSpy).not.toHaveBeenCalled();
    focusSpy.mockRestore();
  });

  it("discards stale intent when navigation goes somewhere else", () => {
    const focusSpy = jest.spyOn(HTMLInputElement.prototype, "focus");
    const { getByRole, getByTestId, rerender } = render(<Harness modal />);
    fireEvent.click(getByRole("button", { name: "Navigate" }));
    mockPathname = "/teachers/programmes/maths-secondary-aqa/units";
    rerender(
      <Harness slugs={{ ...source, subjectSlug: "maths" }} pageKey="other" />,
    );
    mockPathname = destinationPath;
    rerender(<Harness slugs={destination} pageKey="later" />);
    expect(getByTestId("modal-open")).toHaveTextContent("false");
    expect(focusSpy).not.toHaveBeenCalled();
    focusSpy.mockRestore();
  });
});
