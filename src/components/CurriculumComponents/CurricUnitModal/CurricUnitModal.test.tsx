import userEvent from "@testing-library/user-event";
import { act } from "@testing-library/react";

import CurricUnitModal from "./CurricUnitModal";
import {
  mockUnit,
  mockOptionalityUnit,
  mockYearData,
} from "./CurricUnitModal.fixtures";

import renderWithTheme from "@/__tests__/__helpers__/renderWithTheme";

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

describe("Unit modal", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders with correct heading", () => {
    const { getByText } = renderWithTheme(
      <CurricUnitModal
        selectedThread={null}
        unitData={mockUnit}
        yearData={mockYearData}
        basePath={"/teachers/curriculum/english-primary/units"}
        unitOptionData={undefined}
      />,
    );
    expect(getByText("Composition of numbers 6 to 10")).toBeInTheDocument();
  });

  test("renders the correct number of threads", () => {
    const { getAllByTestId, getByText } = renderWithTheme(
      <CurricUnitModal
        selectedThread={null}
        unitData={mockUnit}
        yearData={mockYearData}
        basePath={"/teachers/curriculum/english-primary/units"}
        unitOptionData={undefined}
      />,
    );
    const testThread = getByText("Number: Addition and Subtraction");
    const testThread2 = getByText("Number");

    expect(getAllByTestId("thread-tag")).toHaveLength(2);
    expect(testThread).toBeInTheDocument();
    expect(testThread2).toBeInTheDocument();
  });

  test("lesson metadata renders correct data", () => {
    const { getByText } = renderWithTheme(
      <CurricUnitModal
        selectedThread={null}
        unitData={mockUnit}
        yearData={mockYearData}
        basePath={"/teachers/curriculum/english-primary/units"}
        unitOptionData={undefined}
      />,
    );

    expect(getByText("Maths")).toBeInTheDocument();
    expect(getByText("Year 1")).toBeInTheDocument();
  });

  describe("non-optional units", () => {
    test("does not render optionality card", () => {
      const { queryByTestId } = renderWithTheme(
        <CurricUnitModal
          selectedThread={null}
          unitData={mockUnit}
          yearData={mockYearData}
          basePath={"/teachers/curriculum/english-primary/units"}
          unitOptionData={undefined}
        />,
      );

      expect(queryByTestId("unit-option-card")).not.toBeInTheDocument();
    });

    test("renders CurriculumUnitDetails component", () => {
      const { getByTestId } = renderWithTheme(
        <CurricUnitModal
          selectedThread={null}
          unitData={mockUnit}
          yearData={mockYearData}
          basePath={"/teachers/curriculum/english-primary/units"}
          unitOptionData={undefined}
        />,
      );

      expect(getByTestId("curriculum-unit-details")).toBeVisible();
    });
  });

  describe("optional units", () => {
    test("optionality cards render", () => {
      const { getByTestId } = renderWithTheme(
        <CurricUnitModal
          selectedThread={null}
          unitData={mockOptionalityUnit}
          yearData={mockYearData}
          basePath={"/teachers/curriculum/english-primary/units"}
          unitOptionData={undefined}
        />,
      );

      const optionalityCard = getByTestId("unit-options-card");
      expect(optionalityCard).toBeInTheDocument();
    });

    test("does not render CurriculumUnitDetails component", () => {
      const { queryByTestId } = renderWithTheme(
        <CurricUnitModal
          selectedThread={null}
          unitData={mockOptionalityUnit}
          yearData={mockYearData}
          basePath={"/teachers/curriculum/english-primary/units"}
          unitOptionData={undefined}
        />,
      );

      expect(queryByTestId("curriculum-unit-details")).not.toBeInTheDocument();
    });

    test("optionality cards render correct number of units", () => {
      const { getAllByTestId } = renderWithTheme(
        <CurricUnitModal
          selectedThread={null}
          unitData={mockOptionalityUnit}
          yearData={mockYearData}
          basePath={"/teachers/curriculum/english-primary/units"}
          unitOptionData={undefined}
        />,
      );

      expect(getAllByTestId("unit-info-link")).toHaveLength(3);
    });

    test("optionality cards render correct unit titles", () => {
      const { getByText } = renderWithTheme(
        <CurricUnitModal
          selectedThread={null}
          unitData={mockOptionalityUnit}
          yearData={mockYearData}
          basePath={"/teachers/curriculum/english-primary/units"}
          unitOptionData={undefined}
        />,
      );

      expect(getByText("Test optional unit 1")).toBeInTheDocument();
      expect(getByText("Test optional unit 2")).toBeInTheDocument();
      expect(getByText("Test optional unit 3")).toBeInTheDocument();
    });

    test("selecting optional unit card button, renders CurriculumUnitDetails component", async () => {
      const { getAllByTestId, queryByTestId } = renderWithTheme(
        <CurricUnitModal
          selectedThread={null}
          unitData={mockOptionalityUnit}
          yearData={mockYearData}
          basePath={"/teachers/curriculum/english-primary/units"}
          unitOptionData={undefined}
        />,
      );

      const optionalityButton = getAllByTestId("unit-info-link")[0];

      expect(queryByTestId("curriculum-unit-details")).not.toBeInTheDocument();

      if (optionalityButton) {
        await userEvent.click(optionalityButton);

        // TODO: Detect navigation to optionality modal with URL
      } else {
        throw new Error("Optionality button not found");
      }
    });
  });

  describe("analytics: unitOverviewExplored", () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it("sends a tracking event when unit modal accordian is clicked", async () => {
      const mockLessons = [
        { title: "Test lesson" },
        { title: "Test lesson 2" },
      ];

      const { getAllByTestId } = renderWithTheme(
        <CurricUnitModal
          selectedThread={null}
          unitData={{ ...mockUnit, lessons: mockLessons }}
          yearData={mockYearData}
          basePath={"/teachers/curriculum/english-primary/units"}
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
