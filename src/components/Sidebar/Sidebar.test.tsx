import userEvent from "@testing-library/user-event";

import Sidebar from "./Sidebar";

import renderWithTheme from "@/__tests__/__helpers__/renderWithTheme";
import {
  mockUnit,
  mockOptionalityUnit,
} from "@/components/UnitModal/UnitModal.fixture";

describe("Sidebar component", () => {
  test("should render the sidebar", () => {
    const { getByTestId } = renderWithTheme(
      <Sidebar displayModal={true} onClose={jest.fn()} />,
    );

    expect(getByTestId("sidebar-modal")).toBeInTheDocument();
  });

  test("should render the sidebar with children", () => {
    const { getByTestId } = renderWithTheme(
      <Sidebar displayModal={true} onClose={jest.fn()}>
        <div data-testid="sidebar-children" />
      </Sidebar>,
    );

    expect(getByTestId("sidebar-children")).toBeInTheDocument();
  });

  test("onClose state function called when close button selected", async () => {
    const mockClose = jest.fn();
    const { getByTestId } = renderWithTheme(
      <Sidebar displayModal={true} onClose={mockClose} />,
    );

    const user = userEvent.setup();
    const closeButton = getByTestId("close-button");

    console.log(closeButton);

    await user.click(closeButton);

    expect(mockClose).toHaveBeenCalledTimes(1);
  });

  describe("Unit lessons button", () => {
    test("should render the unit lessons button when passed unit data with no optionality", () => {
      const { getByTestId } = renderWithTheme(
        <Sidebar displayModal={true} onClose={jest.fn()} unitData={mockUnit} />,
      );

      expect(getByTestId("unit-lessons-button")).toBeInTheDocument();
    });

    test("should not render the unit info button when passed unit data with optionality", () => {
      const { queryByTestId } = renderWithTheme(
        <Sidebar
          displayModal={true}
          onClose={jest.fn()}
          unitData={mockOptionalityUnit}
          unitOptionsAvailable={true}
        />,
      );

      expect(queryByTestId("unit-lessons-button")).not.toBeInTheDocument();
    });
  });
});
