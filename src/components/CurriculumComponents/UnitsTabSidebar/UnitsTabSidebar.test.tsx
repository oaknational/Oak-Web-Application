import userEvent from "@testing-library/user-event";

import { Lesson } from "../UnitModal/UnitModal";

import UnitsTabSidebar from "./UnitsTabSidebar";

import renderWithTheme from "@/__tests__/__helpers__/renderWithTheme";
import {
  mockOptionalityUnit,
  mockUnitKS4,
} from "@/components/CurriculumComponents/UnitModal/UnitModal.fixture";

const lessonsPublished: Lesson[] = [
  {
    slug: "lesson-1",
    title: "Lesson 1",
    _state: "new",
  },
  {
    slug: "lesson-2",
    title: "Lesson 2",
    _state: "published",
  },
  {
    slug: "lesson-3",
    title: "Lesson 3",
    _state: "published",
  },
];

const lessonsUnpublished = [
  {
    slug: "lesson-1",
    title: "Lesson 1",
    _state: "new",
  },
];

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
      <UnitsTabSidebar displayModal={true} onClose={jest.fn()} lessons={[]} />,
    );

    expect(getByTestId("sidebar-modal")).toBeInTheDocument();
  });

  test("should render the sidebar with children", () => {
    const { getByTestId } = renderWithTheme(
      <UnitsTabSidebar displayModal={true} onClose={jest.fn()} lessons={[]}>
        <div data-testid="sidebar-children" />
      </UnitsTabSidebar>,
    );

    expect(getByTestId("sidebar-children")).toBeInTheDocument();
  });

  test("onClose state function called when close button selected", async () => {
    const mockClose = jest.fn();
    const { getByTestId } = renderWithTheme(
      <UnitsTabSidebar displayModal={true} onClose={mockClose} lessons={[]} />,
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
          unitSlug={mockUnitKS4.slug}
          programmeSlug="maths-secondary-ks4-aqa"
          lessons={lessonsPublished}
        />,
      );

      expect(getByTestId("unit-lessons-button")).toBeInTheDocument();
    });

    test("should not render the unit info button when passed unit data with optionality", () => {
      const { queryByTestId } = renderWithTheme(
        <UnitsTabSidebar
          displayModal={true}
          onClose={jest.fn()}
          unitOptionsAvailable={true}
          unitSlug={mockOptionalityUnit.slug}
          lessons={[]}
        />,
      );

      expect(queryByTestId("unit-lessons-button")).not.toBeInTheDocument();
    });

    test("should not render the unit info button when passed no programme slug", () => {
      const { queryByTestId } = renderWithTheme(
        <UnitsTabSidebar
          displayModal={true}
          onClose={jest.fn()}
          unitOptionsAvailable={true}
          unitSlug={mockOptionalityUnit.slug}
          lessons={[]}
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
          unitOptionsAvailable={false}
          unitSlug={mockOptionalityUnit.slug}
          lessons={lessonsUnpublished}
          programmeSlug="maths-primary-ks1"
        />,
      );

      const contentLinkButton = queryByTestId("unit-lessons-button");
      expect(queryByTestId("coming-soon-flag")).toBeInTheDocument();
      expect(contentLinkButton).toBeInTheDocument();
      expect(contentLinkButton).toHaveAttribute("aria-disabled", "true");
    });

    test("should have button and no flag for available units", () => {
      const { queryByTestId } = renderWithTheme(
        <UnitsTabSidebar
          displayModal={true}
          onClose={jest.fn()}
          unitOptionsAvailable={false}
          unitSlug={mockUnitKS4.slug}
          lessons={lessonsPublished}
          programmeSlug="maths-primary-ks1"
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
          unitOptionsAvailable={false}
          unitSlug={mockUnitKS4.slug}
          programmeSlug={"maths-primary-ks1"}
          lessons={lessonsPublished}
        />,
      );

      const linkToUnit = await findByRole("link");
      const forwardLink = linkToUnit.getAttribute("href");
      expect(linkToUnit).toBeInTheDocument();
      expect(linkToUnit).toHaveAttribute("aria-disabled", "false");
      expect(forwardLink).toEqual(
        "/teachers/programmes/maths-primary-ks1/units/composition-of-numbers-6-to-10/lessons",
      );
    });

    test("user is directed to correct link for available unit for ks4 with exam board", async () => {
      const { findByRole } = renderWithTheme(
        <UnitsTabSidebar
          displayModal={true}
          onClose={jest.fn()}
          unitOptionsAvailable={false}
          programmeSlug={"maths-secondary-ks4-aqa"}
          unitSlug={mockUnitKS4.slug}
          lessons={lessonsPublished}
        />,
      );

      const linkToUnit = await findByRole("link");
      const forwardLink = linkToUnit.getAttribute("href");
      expect(linkToUnit).toBeInTheDocument();
      expect(linkToUnit).toHaveAttribute("aria-disabled", "false");
      expect(forwardLink).toEqual(
        "/teachers/programmes/maths-secondary-ks4-aqa/units/composition-of-numbers-6-to-10/lessons",
      );
    });

    test("user is directed to correct link for unit variant", async () => {
      const { findByRole, queryByTestId } = renderWithTheme(
        <UnitsTabSidebar
          displayModal={true}
          onClose={jest.fn()}
          unitOptionsAvailable={false}
          programmeSlug={"maths-primary-ks1"}
          unitSlug={mockOptionalityUnit.slug}
          lessons={lessonsPublished}
          unitVariantID={2}
        />,
      );

      const linkToUnit = await findByRole("link");
      const forwardLink = linkToUnit.getAttribute("href");
      expect(linkToUnit).toBeInTheDocument();
      expect(linkToUnit).toHaveAttribute("aria-disabled", "false");
      expect(queryByTestId("coming-soon-flag")).not.toBeInTheDocument();
      expect(forwardLink).toEqual(
        "/teachers/programmes/maths-primary-ks1/units/composition-of-numbers-6-to-10-2/lessons",
      );
    });
  });
});
