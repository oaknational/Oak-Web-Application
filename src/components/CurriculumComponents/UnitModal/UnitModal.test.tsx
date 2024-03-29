import userEvent from "@testing-library/user-event";

import UnitModal from "./UnitModal";
import { mockUnit, mockOptionalityUnit } from "./UnitModal.fixture";

import renderWithTheme from "@/__tests__/__helpers__/renderWithTheme";

const unitInformationViewed = jest.fn();
jest.mock("@/context/Analytics/useAnalytics", () => ({
  __esModule: true,
  default: () => ({
    track: {
      unitInformationViewed: (...args: unknown[]) =>
        unitInformationViewed(...args),
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
        displayModal={true}
        unitData={mockUnit}
        unitOptionsAvailable={false}
        setUnitOptionsAvailable={stateFn}
        isHighlighted={false}
        setUnitVariantID={stateFn}
      />,
    );
    expect(getByText("Composition of numbers 6 to 10")).toBeInTheDocument();
  });

  test("renders the correct number of threads", () => {
    const { getAllByTestId, getByText } = renderWithTheme(
      <UnitModal
        setCurrentUnitLessons={stateFn}
        displayModal={true}
        unitData={mockUnit}
        unitOptionsAvailable={false}
        setUnitOptionsAvailable={stateFn}
        isHighlighted={false}
        setUnitVariantID={stateFn}
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
        displayModal={true}
        unitData={mockUnit}
        unitOptionsAvailable={false}
        setUnitOptionsAvailable={stateFn}
        isHighlighted={false}
        setUnitVariantID={stateFn}
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
          displayModal={true}
          unitData={mockUnit}
          unitOptionsAvailable={false}
          setUnitOptionsAvailable={stateFn}
          isHighlighted={false}
          setUnitVariantID={stateFn}
        />,
      );

      expect(queryByTestId("unit-option-card")).not.toBeInTheDocument();
    });

    test("renders CurriculumUnitDetails component", () => {
      const { getByTestId } = renderWithTheme(
        <UnitModal
          setCurrentUnitLessons={stateFn}
          displayModal={true}
          unitData={mockUnit}
          unitOptionsAvailable={false}
          setUnitOptionsAvailable={stateFn}
          isHighlighted={false}
          setUnitVariantID={stateFn}
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
          displayModal={true}
          unitData={mockOptionalityUnit}
          unitOptionsAvailable={true}
          setUnitOptionsAvailable={stateFn}
          isHighlighted={false}
          setUnitVariantID={stateFn}
        />,
      );

      const optionalityCard = getByTestId("unit-options-card");
      expect(optionalityCard).toBeInTheDocument();
    });

    test("does not render CurriculumUnitDetails component", () => {
      const { queryByTestId } = renderWithTheme(
        <UnitModal
          setCurrentUnitLessons={stateFn}
          displayModal={true}
          unitData={mockOptionalityUnit}
          unitOptionsAvailable={true}
          setUnitOptionsAvailable={stateFn}
          isHighlighted={false}
          setUnitVariantID={stateFn}
        />,
      );

      expect(queryByTestId("curriculum-unit-details")).not.toBeInTheDocument();
    });

    test("optionality cards render correct number of units", () => {
      const { getAllByTestId } = renderWithTheme(
        <UnitModal
          setCurrentUnitLessons={stateFn}
          displayModal={true}
          unitData={mockOptionalityUnit}
          unitOptionsAvailable={true}
          setUnitOptionsAvailable={stateFn}
          isHighlighted={false}
          setUnitVariantID={stateFn}
        />,
      );

      expect(getAllByTestId("unit-option")).toHaveLength(3);
    });

    test("optionality cards render correct unit titles", () => {
      const { getByText } = renderWithTheme(
        <UnitModal
          setCurrentUnitLessons={stateFn}
          displayModal={true}
          unitData={mockOptionalityUnit}
          unitOptionsAvailable={true}
          setUnitOptionsAvailable={stateFn}
          isHighlighted={false}
          setUnitVariantID={stateFn}
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
            displayModal={true}
            unitData={mockOptionalityUnit}
            unitOptionsAvailable={true}
            setUnitOptionsAvailable={stateFn}
            isHighlighted={false}
            setUnitVariantID={stateFn}
          />,
        );

      const optionalityButton = getAllByTestId("unit-info-button")[0];

      expect(queryByTestId("curriculum-unit-details")).not.toBeInTheDocument();

      if (optionalityButton) {
        await userEvent.click(optionalityButton);

        expect(getByTestId("curriculum-unit-details")).toBeVisible();

        expect(getByText("Threads")).toBeInTheDocument();
      } else {
        throw new Error("Optionality button not found");
      }
    });
  });
  test("calls tracking.unitInformationViewed once, with correct props", async () => {
    renderWithTheme(
      <UnitModal
        setCurrentUnitLessons={stateFn}
        displayModal={true}
        unitData={mockOptionalityUnit}
        unitOptionsAvailable={true}
        setUnitOptionsAvailable={stateFn}
        setUnitVariantID={stateFn}
        isHighlighted={false}
      />,
    );

    expect(unitInformationViewed).toHaveBeenCalledTimes(1);
    expect(unitInformationViewed).toHaveBeenCalledWith({
      unitName: "Composition of numbers 6 to 10",
      unitSlug: "composition-of-numbers-6-to-10",
      subjectTitle: "Maths",
      subjectSlug: "maths",
      yearGroupName: "1",
      yearGroupSlug: "1",
      unitHighlighted: false,
      analyticsUseCase: null,
    });
  });
});
