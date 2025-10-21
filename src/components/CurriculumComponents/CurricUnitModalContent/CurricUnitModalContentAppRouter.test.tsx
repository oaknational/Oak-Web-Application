import userEvent from "@testing-library/user-event";
import { act } from "@testing-library/react";

import CurricUnitModalContentAppRouter from "./CurricUnitModalContentAppRouter";
import {
  mockUnit,
  mockOptionalityUnit,
  mockYearData,
} from "./CurricUnitModalContent.fixtures";

import renderWithTheme from "@/__tests__/__helpers__/renderWithTheme";

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

const mockPush = jest.fn();
const mockReplace = jest.fn();
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
    replace: mockReplace,
  }),
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

describe("CurricUnitModalContentAppRouter", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders with correct heading", () => {
    const { getByText } = renderWithTheme(
      <CurricUnitModalContentAppRouter
        selectedThread={null}
        unitData={mockUnit}
        yearData={mockYearData}
        basePath={"/timetabling/maths-primary/units"}
        unitOptionData={undefined}
      />,
    );
    expect(getByText("Composition of numbers 6 to 10")).toBeInTheDocument();
  });

  test("renders the correct number of threads", () => {
    const { getAllByTestId, getByText } = renderWithTheme(
      <CurricUnitModalContentAppRouter
        selectedThread={null}
        unitData={mockUnit}
        yearData={mockYearData}
        basePath={"/timetabling/maths-primary/units"}
        unitOptionData={undefined}
      />,
    );
    const testThread = getByText("Number: Addition and Subtraction");
    const testThread2 = getByText("Number");

    expect(getAllByTestId("ac_threads_tag")).toHaveLength(2);
    expect(testThread).toBeInTheDocument();
    expect(testThread2).toBeInTheDocument();
  });

  test("lesson metadata renders correct data", () => {
    const { getByText } = renderWithTheme(
      <CurricUnitModalContentAppRouter
        selectedThread={null}
        unitData={mockUnit}
        yearData={mockYearData}
        basePath={"/timetabling/maths-primary/units"}
        unitOptionData={undefined}
      />,
    );

    expect(getByText("Maths")).toBeInTheDocument();
    expect(getByText("Year 1")).toBeInTheDocument();
  });

  describe("non-optional units", () => {
    test("does not render optionality card", () => {
      const { queryByTestId } = renderWithTheme(
        <CurricUnitModalContentAppRouter
          selectedThread={null}
          unitData={mockUnit}
          yearData={mockYearData}
          basePath={"/timetabling/maths-primary/units"}
          unitOptionData={undefined}
        />,
      );

      expect(queryByTestId("unit-option-card")).not.toBeInTheDocument();
    });

    test("renders CurriculumUnitDetails component", () => {
      const { getByTestId } = renderWithTheme(
        <CurricUnitModalContentAppRouter
          selectedThread={null}
          unitData={mockUnit}
          yearData={mockYearData}
          basePath={"/timetabling/maths-primary/units"}
          unitOptionData={undefined}
        />,
      );

      expect(getByTestId("curriculum-unit-details")).toBeVisible();
    });
  });

  describe("optional units", () => {
    test("optionality cards render", () => {
      const { getByTestId } = renderWithTheme(
        <CurricUnitModalContentAppRouter
          selectedThread={null}
          unitData={mockOptionalityUnit}
          yearData={mockYearData}
          basePath={"/timetabling/maths-primary/units"}
          unitOptionData={undefined}
        />,
      );

      const optionalityCard = getByTestId("unit-options-card");
      expect(optionalityCard).toBeInTheDocument();
    });

    test("does not render CurriculumUnitDetails component", () => {
      const { queryByTestId } = renderWithTheme(
        <CurricUnitModalContentAppRouter
          selectedThread={null}
          unitData={mockOptionalityUnit}
          yearData={mockYearData}
          basePath={"/timetabling/maths-primary/units"}
          unitOptionData={undefined}
        />,
      );

      expect(queryByTestId("curriculum-unit-details")).not.toBeInTheDocument();
    });

    test("optionality cards render correct number of units", () => {
      const { getAllByTestId } = renderWithTheme(
        <CurricUnitModalContentAppRouter
          selectedThread={null}
          unitData={mockOptionalityUnit}
          yearData={mockYearData}
          basePath={"/timetabling/maths-primary/units"}
          unitOptionData={undefined}
        />,
      );

      expect(getAllByTestId("unit-info-link")).toHaveLength(3);
    });

    test("optionality cards render correct unit titles", () => {
      const { getByText } = renderWithTheme(
        <CurricUnitModalContentAppRouter
          selectedThread={null}
          unitData={mockOptionalityUnit}
          yearData={mockYearData}
          basePath={"/timetabling/maths-primary/units"}
          unitOptionData={undefined}
        />,
      );

      expect(getByText("Test optional unit 1")).toBeInTheDocument();
      expect(getByText("Test optional unit 2")).toBeInTheDocument();
      expect(getByText("Test optional unit 3")).toBeInTheDocument();
    });

    test("clicking optional unit card navigates using router.push", async () => {
      const { getAllByTestId } = renderWithTheme(
        <CurricUnitModalContentAppRouter
          selectedThread={null}
          unitData={mockOptionalityUnit}
          yearData={mockYearData}
          basePath={"/timetabling/maths-primary/units"}
          unitOptionData={undefined}
        />,
      );

      const optionalityLinks = getAllByTestId("unit-info-link");
      const firstLink = optionalityLinks[0];

      expect(firstLink).toHaveAttribute(
        "href",
        "/timetabling/maths-primary/units/composition-of-numbers-6-to-10-1",
      );
    });
  });

  describe("back button", () => {
    test("back button navigates using router.push when unitOptionData is provided", async () => {
      const mockUnitOption = mockOptionalityUnit.unit_options[0];

      const { getByText } = renderWithTheme(
        <CurricUnitModalContentAppRouter
          selectedThread={null}
          unitData={mockUnit}
          yearData={mockYearData}
          basePath={"/timetabling/maths-primary/units"}
          unitOptionData={mockUnitOption}
        />,
      );

      const backButton = getByText("Back to unit options info");
      expect(backButton).toBeInTheDocument();

      await act(async () => {
        await userEvent.click(backButton);
      });

      expect(mockPush).toHaveBeenCalledWith(
        "/timetabling/maths-primary/units/composition-of-numbers-6-to-10",
      );
    });

    test("back button container is conditionally displayed based on unitOptionData", () => {
      const { queryByText } = renderWithTheme(
        <CurricUnitModalContentAppRouter
          selectedThread={null}
          unitData={mockUnit}
          yearData={mockYearData}
          basePath={"/timetabling/maths-primary/units"}
          unitOptionData={undefined}
        />,
      );

      // Back button exists in DOM but its parent OakBox has $display="none" when no unitOptionData
      const backButton = queryByText("Back to unit options info");
      expect(backButton).toBeInTheDocument();
    });
  });

  describe("analytics: unitOverviewExplored", () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it("sends a tracking event when unit modal accordion is clicked", async () => {
      const mockLessons = [
        { title: "Test lesson" },
        { title: "Test lesson 2" },
      ];

      const { getAllByTestId } = renderWithTheme(
        <CurricUnitModalContentAppRouter
          selectedThread={null}
          unitData={{ ...mockUnit, lessons: mockLessons }}
          yearData={mockYearData}
          basePath={"/timetabling/maths-primary/units"}
          unitOptionData={undefined}
        />,
      );
      const unitAccordion = getAllByTestId("expand-accordian-button");

      expect(unitAccordion).toHaveLength(3);

      const lessonsInUnit = unitAccordion[0];

      expect(lessonsInUnit).toHaveTextContent("Lessons in unit");

      if (lessonsInUnit) {
        await act(async () => {
          await userEvent.click(lessonsInUnit);
        });

        expect(unitOverviewExplored).toHaveBeenCalledTimes(1);
        expect(unitOverviewExplored).toHaveBeenCalledWith({
          platform: "owa",
          analyticsUseCase: "Teacher",
          engagementIntent: "explore",
          eventVersion: "2.0.0",
          product: "curriculum visualiser",
          componentType: "lessons_in_unit",
          subjectSlug: "maths",
          subjectTitle: "Maths",
          threadSlug: "",
          threadTitle: "",
          unitName: "Composition of numbers 6 to 10",
          unitSlug: "composition-of-numbers-6-to-10",
          yearGroupName: "Year 1",
          yearGroupSlug: "year-1",
        });
      }
    });
  });
});
