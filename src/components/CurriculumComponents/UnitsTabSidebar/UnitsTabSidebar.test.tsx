import userEvent from "@testing-library/user-event";

import UnitsTabSidebar from "./UnitsTabSidebar";

import renderWithTheme from "@/__tests__/__helpers__/renderWithTheme";
import {
  mockUnit,
  mockOptionalityUnit,
} from "@/components/CurriculumComponents/UnitModal/UnitModal.fixture";

describe("UnitsTabSidebar component", () => {
  it("should render the sidebar", () => {
    const { getByTestId } = renderWithTheme(
      <UnitsTabSidebar displayModal={true} onClose={vi.fn()} />,
    );

    expect(getByTestId("sidebar-modal")).toBeInTheDocument();
  });

  it("should render the sidebar with children", () => {
    const { getByTestId } = renderWithTheme(
      <UnitsTabSidebar displayModal={true} onClose={vi.fn()}>
        <div data-testid="sidebar-children" />
      </UnitsTabSidebar>,
    );

    expect(getByTestId("sidebar-children")).toBeInTheDocument();
  });

  it("onClose state function called when close button selected", async () => {
    const mockClose = vi.fn();
    const { getByTestId } = renderWithTheme(
      <UnitsTabSidebar displayModal={true} onClose={mockClose} />,
    );

    const user = userEvent.setup();
    const closeButton = getByTestId("close-button");

    console.log(closeButton);

    await user.click(closeButton);

    expect(mockClose).toHaveBeenCalledTimes(1);
  });

  describe("Unit lessons button", () => {
    it("should render the unit lessons button when passed unit data with no optionality", () => {
      const { getByTestId } = renderWithTheme(
        <UnitsTabSidebar
          displayModal={true}
          onClose={vi.fn()}
          unitData={mockUnit}
        />,
      );

      expect(getByTestId("unit-lessons-button")).toBeInTheDocument();
    });

    it("should not render the unit info button when passed unit data with optionality", () => {
      const { queryByTestId } = renderWithTheme(
        <UnitsTabSidebar
          displayModal={true}
          onClose={vi.fn()}
          unitData={mockOptionalityUnit}
          unitOptionsAvailable={true}
        />,
      );

      expect(queryByTestId("unit-lessons-button")).not.toBeInTheDocument();
    });
  });
});
