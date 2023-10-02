import userEvent from "@testing-library/user-event";

import Sidebar from "./Sidebar";

import renderWithTheme from "@/__tests__/__helpers__/renderWithTheme";
import {
  mockUnit,
  mockOptionalityUnit,
} from "@/components/UnitModal/UnitModal.test";

/**
 * ! Refactor mockUnits into a fixture data
 */

describe("Sidebar component", () => {
  test("should render the sidebar", () => {
    const { getByTestId } = renderWithTheme(
      <Sidebar displayModal={true} onClose={jest.fn()} unitData={mockUnit} />,
    );

    expect(getByTestId("sidebar-modal")).toBeInTheDocument();
  });

  test("should render the sidebar with children", () => {
    const { getByTestId } = renderWithTheme(
      <Sidebar displayModal={true} onClose={jest.fn()} unitData={mockUnit}>
        <div data-testid="sidebar-children" />
      </Sidebar>,
    );

    expect(getByTestId("sidebar-children")).toBeInTheDocument();
  });

  test("should render the sidebar with a close icon and close button", () => {
    const { getAllByTestId } = renderWithTheme(
      <Sidebar displayModal={true} onClose={jest.fn()} unitData={mockUnit} />,
    );

    expect(getAllByTestId("close-button")).toHaveLength(2);
  });

  // How do you test if something is not visible?
  test.skip("aria-expanded should be false when sidebar is closed", async () => {
    const mockClose = jest.fn();
    const { getByLabelText } = renderWithTheme(
      <Sidebar displayModal={true} onClose={mockClose} unitData={mockUnit} />,
    );

    const user = userEvent.setup();
    const closeButton = getByLabelText("Close Menu");

    await user.click(closeButton);

    expect(mockClose).toHaveBeenCalledTimes(1);
    expect(closeButton).toHaveAttribute("aria-expanded", "false");
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
        />,
      );

      expect(queryByTestId("unit-lessons-button")).not.toBeInTheDocument();
    });
  });
});
