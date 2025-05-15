import CurricUnitModalFooter from "./CurricUnitModalFooter";
import {
  mockUnit,
  mockUnitWithLessons,
  mockUnitWithOptions,
} from "./CurricUnitModalFooter.fixtures";

import renderWithProviders from "@/__tests__/__helpers__/renderWithProviders";

const render = renderWithProviders();

describe("CurricUnitModalFooter", () => {
  it("should show disabled link without lessons", () => {
    const { getByTestId } = render(
      <CurricUnitModalFooter
        programmeSlug="english-primary"
        unitData={mockUnit}
        unitOptionData={undefined}
      />,
    );
    expect(getByTestId("unit-lessons-button")).toHaveTextContent(
      "Coming soonSee lessons in unit",
    );
  });

  it("should show link with lessons", () => {
    const { getByTestId } = render(
      <CurricUnitModalFooter
        programmeSlug="english-primary"
        unitData={mockUnitWithLessons}
        unitOptionData={undefined}
      />,
    );
    expect(getByTestId("unit-lessons-button")).toHaveTextContent(
      "See lessons in unit",
    );
  });

  it("shouldn't display with unit options on unit", () => {
    const { baseElement } = render(
      <CurricUnitModalFooter
        programmeSlug="english-primary"
        unitData={mockUnitWithOptions}
        unitOptionData={undefined}
      />,
    );
    expect(baseElement.querySelector("unit-lessons-button")).toBeFalsy();
  });
});
