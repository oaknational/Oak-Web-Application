import userEvent from "@testing-library/user-event";

import UnitModal from "./UnitModal";
import {
  mockUnit,
  mockOptionalityUnit,
  mockYearData,
} from "./UnitModal.fixture";

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
  const stateFn = jest.fn();

  test("renders with correct heading", () => {
    const { getByText } = renderWithTheme(
      <UnitModal
        setCurrentUnitLessons={stateFn}
        selectedThread={null}
        displayModal={true}
        unitData={mockUnit}
        unitOptionsAvailable={false}
        setUnitOptionsAvailable={stateFn}
        setUnitVariantID={stateFn}
        yearData={mockYearData}
      />,
    );
    expect(getByText("Composition of numbers 6 to 10")).toBeInTheDocument();
  });

  test("renders the correct number of threads", () => {
    const { getAllByTestId, getByText } = renderWithTheme(
      <UnitModal
        setCurrentUnitLessons={stateFn}
        selectedThread={null}
        displayModal={true}
        unitData={mockUnit}
        unitOptionsAvailable={false}
        setUnitOptionsAvailable={stateFn}
        setUnitVariantID={stateFn}
        yearData={mockYearData}
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
      <UnitModal
        setCurrentUnitLessons={stateFn}
        selectedThread={null}
        displayModal={true}
        unitData={mockUnit}
        unitOptionsAvailable={false}
        setUnitOptionsAvailable={stateFn}
        setUnitVariantID={stateFn}
        yearData={mockYearData}
      />,
    );

    expect(getByText("Maths")).toBeInTheDocument();
    expect(getByText("Year 1")).toBeInTheDocument();
  });

  describe("non-optional units", () => {
    test("does not render optionality card", () => {
      const { queryByTestId } = renderWithTheme(
        <UnitModal
          setCurrentUnitLessons={stateFn}
          selectedThread={null}
          displayModal={true}
          unitData={mockUnit}
          unitOptionsAvailable={false}
          setUnitOptionsAvailable={stateFn}
          setUnitVariantID={stateFn}
          yearData={mockYearData}
        />,
      );

      expect(queryByTestId("unit-option-card")).not.toBeInTheDocument();
    });

    test("renders CurriculumUnitDetails component", () => {
      const { getByTestId } = renderWithTheme(
        <UnitModal
          setCurrentUnitLessons={stateFn}
          selectedThread={null}
          displayModal={true}
          unitData={mockUnit}
          unitOptionsAvailable={false}
          setUnitOptionsAvailable={stateFn}
          setUnitVariantID={stateFn}
          yearData={mockYearData}
        />,
      );

      expect(getByTestId("curriculum-unit-details")).toBeVisible();
    });
  });

  describe("optional units", () => {
    test("optionality cards render", () => {
      const { getByTestId } = renderWithTheme(
        <UnitModal
          setCurrentUnitLessons={stateFn}
          selectedThread={null}
          displayModal={true}
          unitData={mockOptionalityUnit}
          unitOptionsAvailable={true}
          setUnitOptionsAvailable={stateFn}
          setUnitVariantID={stateFn}
          yearData={mockYearData}
        />,
      );

      const optionalityCard = getByTestId("unit-options-card");
      expect(optionalityCard).toBeInTheDocument();
    });

    test("does not render CurriculumUnitDetails component", () => {
      const { queryByTestId } = renderWithTheme(
        <UnitModal
          setCurrentUnitLessons={stateFn}
          selectedThread={null}
          displayModal={true}
          unitData={mockOptionalityUnit}
          unitOptionsAvailable={true}
          setUnitOptionsAvailable={stateFn}
          setUnitVariantID={stateFn}
          yearData={mockYearData}
        />,
      );

      expect(queryByTestId("curriculum-unit-details")).not.toBeInTheDocument();
    });

    test("optionality cards render correct number of units", () => {
      const { getAllByTestId } = renderWithTheme(
        <UnitModal
          setCurrentUnitLessons={stateFn}
          selectedThread={null}
          displayModal={true}
          unitData={mockOptionalityUnit}
          unitOptionsAvailable={true}
          setUnitOptionsAvailable={stateFn}
          setUnitVariantID={stateFn}
          yearData={mockYearData}
        />,
      );

      expect(getAllByTestId("unit-info-button")).toHaveLength(3);
    });

    test("optionality cards render correct unit titles", () => {
      const { getByText } = renderWithTheme(
        <UnitModal
          setCurrentUnitLessons={stateFn}
          selectedThread={null}
          displayModal={true}
          unitData={mockOptionalityUnit}
          unitOptionsAvailable={true}
          setUnitOptionsAvailable={stateFn}
          setUnitVariantID={stateFn}
          yearData={mockYearData}
        />,
      );

      expect(getByText("Test optional unit 1")).toBeInTheDocument();
      expect(getByText("Test optional unit 2")).toBeInTheDocument();
      expect(getByText("Test optional unit 3")).toBeInTheDocument();
    });

    test("selecting optional unit card button, renders CurriculumUnitDetails component", async () => {
      const { getAllByTestId, getByTestId, getByText, queryByTestId } =
        renderWithTheme(
          <UnitModal
            setCurrentUnitLessons={stateFn}
            selectedThread={null}
            displayModal={true}
            unitData={mockOptionalityUnit}
            unitOptionsAvailable={true}
            setUnitOptionsAvailable={stateFn}
            setUnitVariantID={stateFn}
            yearData={mockYearData}
          />,
        );

      const optionalityButton = getAllByTestId("unit-info-button")[0];

      expect(queryByTestId("curriculum-unit-details")).not.toBeInTheDocument();

      if (optionalityButton) {
        await userEvent.click(optionalityButton);

        expect(getByTestId("curriculum-unit-details")).toBeVisible();

        const titleElement = getByTestId("unit-optionality-title");
        expect(titleElement).toBeInTheDocument();
        expect(titleElement).toHaveTextContent(mockOptionalityUnit.title);
        expect(getByText("Threads")).toBeInTheDocument();
      } else {
        throw new Error("Optionality button not found");
      }
    });
  });
});
