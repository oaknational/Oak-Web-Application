import UnitModal from "./UnitModal";
import { mockUnit, mockOptionalityUnit } from "./UnitModal.fixture";

import renderWithTheme from "@/__tests__/__helpers__/renderWithTheme";

describe("Unit modal", () => {
  const stateFn = jest.fn();
  beforeEach(() => {
    jest.resetAllMocks();
  });

  test("renders with correct heading", () => {
    const { getByText } = renderWithTheme(
      <UnitModal
        displayModal={true}
        unitData={mockUnit}
        unitOptionsAvailable={false}
        setUnitOptionsAvailable={stateFn}
      />,
    );
    expect(getByText("Composition of numbers 6 to 10")).toBeInTheDocument();
  });

  test("renders the correct number of threads", () => {
    const { getAllByTestId, getByText } = renderWithTheme(
      <UnitModal
        displayModal={true}
        unitData={mockUnit}
        unitOptionsAvailable={false}
        setUnitOptionsAvailable={stateFn}
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
        displayModal={true}
        unitData={mockUnit}
        unitOptionsAvailable={false}
        setUnitOptionsAvailable={stateFn}
      />,
    );

    expect(getByText("Maths")).toBeInTheDocument();
    expect(getByText("Year 1")).toBeInTheDocument();
  });

  describe("non-optional units", () => {
    test("does not render optionality card", () => {
      const { queryAllByTestId } = renderWithTheme(
        <UnitModal
          displayModal={true}
          unitData={mockUnit}
          unitOptionsAvailable={false}
          setUnitOptionsAvailable={stateFn}
        />,
      );

      expect(queryAllByTestId("unit-option-card")).toHaveLength(0);
    });
  });

  describe("optional units", () => {
    test("optionality cards render", () => {
      const { getByTestId } = renderWithTheme(
        <UnitModal
          displayModal={true}
          unitData={mockOptionalityUnit}
          unitOptionsAvailable={true}
          setUnitOptionsAvailable={stateFn}
        />,
      );

      const optionalityCard = getByTestId("unit-options-card");
      expect(optionalityCard).toBeInTheDocument();
    });

    test("optionality cards render correct number of units", () => {
      const { getAllByTestId } = renderWithTheme(
        <UnitModal
          displayModal={true}
          unitData={mockOptionalityUnit}
          unitOptionsAvailable={true}
          setUnitOptionsAvailable={stateFn}
        />,
      );

      expect(getAllByTestId("unit-option")).toHaveLength(3);
    });
  });
});
