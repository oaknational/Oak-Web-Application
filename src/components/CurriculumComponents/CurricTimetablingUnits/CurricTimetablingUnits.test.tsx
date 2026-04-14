import { waitFor } from "@testing-library/dom";
import { act } from "@testing-library/react";

import { CurricTimetablingUnits } from ".";

import { createUnit } from "@/fixtures/curriculum/unit";
import { fetchSubjectPhasePickerData } from "@/pages-helpers/curriculum/docx/tab-helpers";
import { renderWithProvidersByName } from "@/__tests__/__helpers__/renderWithProviders";

const render = renderWithProvidersByName(["oakTheme"]);

const defaultSearchParams = new URLSearchParams("");
const mockUseSearchParams = jest.fn(() => defaultSearchParams);
const mockReplace = jest.fn();
const mockPush = jest.fn();
const mockUsePathname = jest.fn(() => "/timetabling/maths-primary/units");

jest.mock("next/navigation", () => {
  return {
    __esModule: true,
    usePathname: () => mockUsePathname(),
    useRouter: () => ({ replace: mockReplace, push: mockPush }),
    useSearchParams: () => mockUseSearchParams(),
    notFound: () => {
      throw new Error("NEXT_HTTP_ERROR_FALLBACK;404");
    },
  };
});

Object.assign(navigator, {
  clipboard: {
    writeText: jest.fn(),
  },
});

// Mock HTMLDialogElement methods that jsdom doesn't support
HTMLDialogElement.prototype.showModal = jest.fn();
HTMLDialogElement.prototype.close = jest.fn();

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
  beforeEach(() => {
    jest.clearAllMocks();
    // Reset mocks to default values
    mockUsePathname.mockReturnValue("/timetabling/maths-primary/units");
    mockUseSearchParams.mockReturnValue(new URLSearchParams(""));
  });

  test("snapshot (mode=debug)", () => {
    mockUseSearchParams.mockReturnValue(
      new URLSearchParams("mode=debug&year=1"),
    );
    const { container } = render(
      <CurricTimetablingUnits
        units={[
          createUnit({ slug: "test-1", year: "1" }),
          createUnit({ slug: "test-2", year: "1" }),
        ]}
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

  test("snapshot (mode=normal)", () => {
    mockUseSearchParams.mockReturnValue(
      new URLSearchParams("mode=normal&year=1"),
    );
    const { container } = render(
      <CurricTimetablingUnits
        units={[
          createUnit({ slug: "test-1", year: "1" }),
          createUnit({ slug: "test-2", year: "1" }),
        ]}
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
    const { getAllByRole, getByTestId } = render(
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
    const { getAllByRole } = render(
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
    mockUseSearchParams.mockReturnValue(
      new URLSearchParams("mode=debug&year=1"),
    );
    const { getByText } = render(
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

  test("displays default timetable name when data.name is empty", () => {
    const { getByText } = render(
      <CurricTimetablingUnits
        units={[
          createUnit({
            slug: "test-unit",
            subject: "Maths",
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

    expect(getByText("Your Maths timetable")).toBeInTheDocument();
  });

  test("displays custom timetable name when data.name is set", () => {
    mockUseSearchParams.mockReturnValue(
      new URLSearchParams(
        `autumn=30&spring=30&summer=30&year=1&name=My Custom Timetable`,
      ),
    );

    const { getByText } = render(
      <CurricTimetablingUnits
        units={[
          createUnit({
            slug: "test-unit",
            subject: "Maths",
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

    expect(getByText("My Custom Timetable")).toBeInTheDocument();
  });

  test("unit modal opens when selectedUnitSlug is provided", () => {
    const { getByTestId } = render(
      <CurricTimetablingUnits
        units={[
          createUnit({
            slug: "test-unit",
            title: "Test Unit",
            year: "1",
          }),
        ]}
        curriculumPhaseOptions={defaultCurriculumPhaseOptions}
        slugs={{
          phaseSlug: "primary",
          subjectSlug: "maths",
          ks4OptionSlug: null,
        }}
        selectedUnitSlug="test-unit"
      />,
    );

    expect(getByTestId("modal")).toBeInTheDocument();
  });

  test("closes modal and navigates to base path", () => {
    const { getByTestId } = render(
      <CurricTimetablingUnits
        units={[
          createUnit({
            slug: "test-unit",
            title: "Test Unit",
            year: "1",
          }),
        ]}
        curriculumPhaseOptions={defaultCurriculumPhaseOptions}
        slugs={{
          phaseSlug: "primary",
          subjectSlug: "maths",
          ks4OptionSlug: null,
        }}
        selectedUnitSlug="test-unit"
      />,
    );

    const closeButton = getByTestId("close-modal-button");

    act(() => {
      closeButton.click();
    });

    expect(mockReplace).toHaveBeenCalledWith(
      "/timetabling/maths-primary/units",
    );
  });

  test("preserves search params when closing modal", () => {
    mockUseSearchParams.mockReturnValue(new URLSearchParams("filter=year1"));

    const { getByTestId } = render(
      <CurricTimetablingUnits
        units={[
          createUnit({
            slug: "test-unit",
            title: "Test Unit",
            year: "1",
          }),
        ]}
        curriculumPhaseOptions={defaultCurriculumPhaseOptions}
        slugs={{
          phaseSlug: "primary",
          subjectSlug: "maths",
          ks4OptionSlug: null,
        }}
        selectedUnitSlug="test-unit"
      />,
    );

    const closeButton = getByTestId("close-modal-button");

    act(() => {
      closeButton.click();
    });

    expect(mockReplace).toHaveBeenCalledWith(
      "/timetabling/maths-primary/units?filter=year1",
    );
  });

  test("strips unit slug from pathname when on unit detail page", () => {
    mockUsePathname.mockReturnValue(
      "/timetabling/maths-primary/units/test-unit",
    );

    const { getByTestId } = render(
      <CurricTimetablingUnits
        units={[
          createUnit({
            slug: "test-unit",
            title: "Test Unit",
            year: "1",
          }),
        ]}
        curriculumPhaseOptions={defaultCurriculumPhaseOptions}
        slugs={{
          phaseSlug: "primary",
          subjectSlug: "maths",
          ks4OptionSlug: null,
        }}
        selectedUnitSlug="test-unit"
      />,
    );

    const closeButton = getByTestId("close-modal-button");

    act(() => {
      closeButton.click();
    });

    // Should strip the /test-unit part and navigate to base /units path
    expect(mockReplace).toHaveBeenCalledWith(
      "/timetabling/maths-primary/units",
    );
  });

  test("displays 404 error when selected unit does not exist", () => {
    const { getByText } = render(
      <CurricTimetablingUnits
        units={[
          createUnit({
            slug: "existing-unit",
            title: "Existing Unit",
            year: "1",
          }),
        ]}
        curriculumPhaseOptions={defaultCurriculumPhaseOptions}
        slugs={{
          phaseSlug: "primary",
          subjectSlug: "maths",
          ks4OptionSlug: null,
        }}
        selectedUnitSlug="non-existent-unit"
      />,
    );

    expect(getByText("This unit does not exist.")).toBeInTheDocument();
    expect(
      getByText("Close the modal to browse available units."),
    ).toBeInTheDocument();
  });

  test("unit links include search params", () => {
    mockUseSearchParams.mockReturnValue(
      new URLSearchParams("mode=debug&year=1"),
    );

    const { getAllByRole } = render(
      <CurricTimetablingUnits
        units={[
          createUnit({
            slug: "test-unit",
            title: "Test Unit",
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

    const links = getAllByRole("link");
    const unitLink = links.find((link) =>
      link.getAttribute("href")?.includes("test-unit"),
    );

    expect(unitLink).toHaveAttribute(
      "href",
      "/timetabling/maths-primary/units/test-unit?mode=debug&year=1",
    );
  });
});
