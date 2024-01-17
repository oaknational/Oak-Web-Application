import userEvent from "@testing-library/user-event";

import UnitsTabSidebar from "./UnitsTabSidebar";

import renderWithTheme from "@/__tests__/__helpers__/renderWithTheme";
import {
  mockUnit,
  mockOptionalityUnit,
  mockUnitKS4,
} from "@/components/CurriculumComponents/UnitModal/UnitModal.fixture";

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

describe("Sidebar component", () => {
  test("should render the sidebar", () => {
    const { getByTestId } = renderWithTheme(
      <UnitsTabSidebar displayModal={true} onClose={jest.fn()} />,
    );

    expect(getByTestId("sidebar-modal")).toBeInTheDocument();
  });

  test("should render the sidebar with children", () => {
    const { getByTestId } = renderWithTheme(
      <UnitsTabSidebar displayModal={true} onClose={jest.fn()}>
        <div data-testid="sidebar-children" />
      </UnitsTabSidebar>,
    );

    expect(getByTestId("sidebar-children")).toBeInTheDocument();
  });

  test("onClose state function called when close button selected", async () => {
    const mockClose = jest.fn();
    const { getByTestId } = renderWithTheme(
      <UnitsTabSidebar displayModal={true} onClose={mockClose} />,
    );

    const user = userEvent.setup();
    const closeButton = getByTestId("close-button");

    await user.click(closeButton);

    expect(mockClose).toHaveBeenCalledTimes(1);
  });

  describe("Unit lessons button", () => {
    test("should render the unit lessons button when passed unit data with no optionality", () => {
      const { getByTestId } = renderWithTheme(
        <UnitsTabSidebar
          displayModal={true}
          onClose={jest.fn()}
          unitData={mockUnit}
          lessonsAvailable={true}
        />,
      );

      expect(getByTestId("unit-lessons-button")).toBeInTheDocument();
    });

    test("should not render the unit info button when passed unit data with optionality", () => {
      const { queryByTestId } = renderWithTheme(
        <UnitsTabSidebar
          displayModal={true}
          onClose={jest.fn()}
          unitData={mockOptionalityUnit}
          lessonsAvailable={false}
          unitOptionsAvailable={true}
        />,
      );

      expect(queryByTestId("unit-lessons-button")).not.toBeInTheDocument();
    });
  });

  describe("Navigate to lesson button", () => {
    test("should render coming soon for unavailable units", () => {
      const { queryByTestId } = renderWithTheme(
        <UnitsTabSidebar
          displayModal={true}
          onClose={jest.fn()}
          unitData={mockOptionalityUnit}
          lessonsAvailable={false}
          unitOptionsAvailable={false}
        />,
      );

      expect(queryByTestId("coming-soon-flag")).toBeInTheDocument();
      expect(queryByTestId("unit-lessons-button")).toBeInTheDocument();
    });

    test("should have button and no flag for available units", () => {
      const { queryByTestId } = renderWithTheme(
        <UnitsTabSidebar
          displayModal={true}
          onClose={jest.fn()}
          unitData={mockOptionalityUnit}
          lessonsAvailable={true}
          unitOptionsAvailable={false}
        />,
      );

      expect(queryByTestId("coming-soon-flag")).not.toBeInTheDocument();
      expect(queryByTestId("unit-lessons-button")).toBeInTheDocument();
    });

    test("user is directed to correct link for available unit for ks3", async () => {
      const { findByRole } = renderWithTheme(
        <UnitsTabSidebar
          displayModal={true}
          onClose={jest.fn()}
          unitData={mockUnit}
          lessonsAvailable={true}
          unitOptionsAvailable={false}
          examboardSlug={"aqa"}
        />,
      );

      const linkToUnit = await findByRole("link");
      const forwardLink = linkToUnit.getAttribute("href");
      expect(linkToUnit).toBeInTheDocument();
      expect(linkToUnit).toBeEnabled();
      expect(forwardLink).toEqual(
        "/teachers/programmes/maths-primary-ks1/units/composition-of-numbers-6-to-10/lessons",
      );
    });

    test("user is directed to correct link for available unit for ks4 with exam board", async () => {
      const { findByRole } = renderWithTheme(
        <UnitsTabSidebar
          displayModal={true}
          onClose={jest.fn()}
          unitData={mockUnitKS4}
          lessonsAvailable={true}
          unitOptionsAvailable={false}
          examboardSlug={"aqa"}
        />,
      );

      const linkToUnit = await findByRole("link");
      const forwardLink = linkToUnit.getAttribute("href");
      expect(linkToUnit).toBeInTheDocument();
      expect(linkToUnit).toBeEnabled();
      expect(forwardLink).toEqual(
        "/teachers/programmes/maths-secondary-ks4-aqa/units/composition-of-numbers-6-to-10/lessons",
      );
    });
  });
});
