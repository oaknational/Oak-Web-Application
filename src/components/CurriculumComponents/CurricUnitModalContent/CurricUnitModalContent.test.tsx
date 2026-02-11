import userEvent from "@testing-library/user-event";
import { act } from "@testing-library/react";

import CurricUnitModalContent from "./CurricUnitModalContent";
import {
  mockUnit,
  mockOptionalityUnit,
  mockYearData,
} from "./CurricUnitModalContent.fixtures";

import { createUnitOption } from "@/fixtures/curriculum/unitOption";
import {
  mockLinkClick,
  setupMockLinkClick,
  teardownMockLinkClick,
} from "@/utils/mockLinkClick";
import { renderWithProvidersByName } from "@/__tests__/__helpers__/renderWithProviders";

const render = renderWithProvidersByName(["oakTheme", "theme"]);

// Mock next/navigation
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

describe("Unit modal", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  beforeEach(() => {
    setupMockLinkClick();
  });

  afterEach(() => {
    teardownMockLinkClick();
  });

  test("renders with correct heading", () => {
    const { getByText } = render(
      <CurricUnitModalContent
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
    const { getAllByTestId, getByText } = render(
      <CurricUnitModalContent
        selectedThread={null}
        unitData={mockUnit}
        yearData={mockYearData}
        basePath={"/teachers/curriculum/english-primary/units"}
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
    const { getByText } = render(
      <CurricUnitModalContent
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
      const { queryByTestId } = render(
        <CurricUnitModalContent
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
      const { getByTestId } = render(
        <CurricUnitModalContent
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
      const { getByTestId } = render(
        <CurricUnitModalContent
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
      const { queryByTestId } = render(
        <CurricUnitModalContent
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
      const { getAllByTestId } = render(
        <CurricUnitModalContent
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
      const { getByText } = render(
        <CurricUnitModalContent
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
      const { getAllByTestId, queryByTestId } = render(
        <CurricUnitModalContent
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

        expect(mockLinkClick).toHaveBeenCalledWith(
          "http://localhost/teachers/curriculum/english-primary/units/composition-of-numbers-6-to-10-1",
        );

        // TODO: Detect navigation to optionality modal with URL
      } else {
        throw new Error("Optionality button not found");
      }
    });
  });

  describe("navigation callback", () => {
    test("calls onNavigateToUnit when back button is clicked", async () => {
      const mockNavigate = jest.fn();
      const mockUnitOption = createUnitOption({
        title: "Unit Option 1",
        slug: "unit-option-1",
        unitvariant_id: 123,
      });

      const { getByText } = render(
        <CurricUnitModalContent
          selectedThread={null}
          unitData={mockUnit}
          yearData={mockYearData}
          basePath={"/teachers/curriculum/english-primary/units"}
          unitOptionData={mockUnitOption}
          onNavigateToUnit={mockNavigate}
        />,
      );

      const backButton = getByText("Back to unit options info");
      await userEvent.click(backButton);

      expect(mockNavigate).toHaveBeenCalledWith(mockUnit.slug);
      expect(mockNavigate).toHaveBeenCalledTimes(1);
    });

    test("back button is hidden when no unit option is selected", () => {
      const { queryByText } = render(
        <CurricUnitModalContent
          selectedThread={null}
          unitData={mockUnit}
          yearData={mockYearData}
          basePath={"/teachers/curriculum/english-primary/units"}
          unitOptionData={undefined}
        />,
      );

      expect(queryByText("Back to unit options info")).not.toBeVisible();
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

      const { getAllByTestId } = render(
        <CurricUnitModalContent
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
