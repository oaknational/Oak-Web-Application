import { waitFor } from "@testing-library/dom";
import { act } from "@testing-library/react";

import { CurricTimetablingUnits } from ".";

import renderWithTheme from "@/__tests__/__helpers__/renderWithTheme";
import { createUnit } from "@/fixtures/curriculum/unit";
import { fetchSubjectPhasePickerData } from "@/pages-helpers/curriculum/docx/tab-helpers";

Object.assign(navigator, {
  clipboard: {
    writeText: jest.fn(),
  },
});

// Mock window.matchMedia
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

const mockReplace = jest.fn();
const mockPush = jest.fn();
jest.mock("next/navigation", () => ({
  usePathname: () => "/timetabling/maths-primary/units",
  useRouter: () => ({ replace: mockReplace, push: mockPush }),
  useSearchParams: () => new URLSearchParams(""),
}));

const unitOverviewExplored = jest.fn();
jest.mock("@/context/Analytics/useAnalytics", () => ({
  __esModule: true,
  default: () => ({
    track: {
      unitOverviewExplored: (...args: unknown[]) =>
        unitOverviewExplored(...args),
    },
  }),
}));

// Mock useTimetableParams to avoid useEffect issues
jest.mock("@/utils/curriculum/timetabling", () => ({
  useTimetableParams: () => [
    {
      autumn: 30,
      spring: 30,
      summer: 30,
      year: "1",
      name: "",
    },
    jest.fn(),
  ],
}));

const defaultCurriculumPhaseOptions: ReturnType<
  typeof fetchSubjectPhasePickerData
> = Promise.resolve({
  tab: "units",
  subjects: [
    {
      slug: "english",
      title: "English",
      phases: [],
      ks4_options: null,
    },
  ],
});

describe("CurricTimetablingUnits", () => {
  test("snapshot", () => {
    const { container } = renderWithTheme(
      <CurricTimetablingUnits
        units={[createUnit({ slug: "test-1" }), createUnit({ slug: "test-2" })]}
        curriculumPhaseOptions={defaultCurriculumPhaseOptions}
        slugs={{
          phaseSlug: "primary",
          subjectSlug: "maths",
          ks4OptionSlug: null,
        }}
      />,
    );
    expect(container).toMatchSnapshot();
  });
  test("edit details", () => {
    const { getAllByRole, getByTestId } = renderWithTheme(
      <CurricTimetablingUnits
        units={[createUnit({ slug: "test-1" }), createUnit({ slug: "test-2" })]}
        curriculumPhaseOptions={defaultCurriculumPhaseOptions}
        slugs={{
          phaseSlug: "primary",
          subjectSlug: "maths",
          ks4OptionSlug: null,
        }}
      />,
    );
    const els = getAllByRole("button");
    expect(els[0]).toHaveTextContent("Edit details");

    act(() => {
      els[0]!.click();
    });

    waitFor(() => {
      expect(getByTestId("edit-details-modal")).toBeTruthy();
    });
  });

  test("copy link", () => {
    const { getAllByRole } = renderWithTheme(
      <CurricTimetablingUnits
        units={[createUnit({ slug: "test-1" }), createUnit({ slug: "test-2" })]}
        curriculumPhaseOptions={defaultCurriculumPhaseOptions}
        slugs={{
          phaseSlug: "primary",
          subjectSlug: "maths",
          ks4OptionSlug: null,
        }}
      />,
    );
    const els = getAllByRole("button");
    expect(els[1]).toHaveTextContent("Copy link");

    act(() => {
      els[1]!.click();
    });

    expect(navigator.clipboard.writeText).toHaveBeenCalled();
  });

  test("units are visible", () => {
    const { getByText } = renderWithTheme(
      <CurricTimetablingUnits
        units={[
          createUnit({
            slug: "addition-and-subtraction",
            title: "Addition and subtraction",
            year: "1",
          }),
          createUnit({
            slug: "multiplication-and-division",
            title: "Multiplication and division",
            year: "1",
          }),
        ]}
        curriculumPhaseOptions={defaultCurriculumPhaseOptions}
        slugs={{
          phaseSlug: "primary",
          subjectSlug: "maths",
          ks4OptionSlug: null,
        }}
      />,
    );

    expect(getByText("📦 Addition and subtraction")).toBeInTheDocument();
    expect(getByText("📦 Multiplication and division")).toBeInTheDocument();
  });
});
