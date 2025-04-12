import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import SubjectListingCard from "./SubjectListingCard";

import renderWithTheme from "@/__tests__/__helpers__/renderWithTheme";
import subjectPagePropsFixture from "@/node-lib/curriculum-api-2023/fixtures/subjectListing.fixture";
import {
  mockLinkClick,
  setupMockLinkClick,
  teardownMockLinkClick,
} from "@/utils/mockLinkClick";

const subjects = subjectPagePropsFixture().subjects;

const subjectSelected = jest.fn();
jest.mock("@/context/Analytics/useAnalytics", () => ({
  __esModule: true,
  default: () => ({
    track: {
      browseRefined: (...args: unknown[]) => subjectSelected(...args),
    },
  }),
}));

describe("SubjectListingCardDouble", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    setupMockLinkClick();
  });

  afterEach(() => {
    teardownMockLinkClick();
  });

  test("render a Card with the Name of the Subject", () => {
    renderWithTheme(
      <SubjectListingCard
        subject={subjects[0]}
        subjectSlug={"biology"}
        keyStageSlug={"ks4"}
        keyStageTitle={"Key stage 4"}
      />,
    );
    expect(screen.getByText("Biology")).toBeInTheDocument();
  });
  test("new units with 1 programme take you to 'teachers' view unit listing page", () => {
    const { getByRole } = renderWithTheme(
      <SubjectListingCard
        subject={subjects[0]}
        subjectSlug={"biology"}
        keyStageSlug={"ks4"}
        keyStageTitle={"Key stage 4"}
      />,
    );
    const cardClickTarget = getByRole("link", {
      name: "Biology: 6 units, 35 lessons - new content",
    });
    expect(cardClickTarget).toBeInTheDocument();
    expect(cardClickTarget).toHaveAttribute(
      "href",
      "/teachers/key-stages/ks4/subjects/biology/programmes",
    );
  });
  test("new units are labeled as 'new'", () => {
    const math = subjects[2];
    if (math) {
      const { getByText } = renderWithTheme(
        <SubjectListingCard
          subject={math}
          subjectSlug={"maths"}
          keyStageSlug={"ks4"}
          keyStageTitle={"Key stage 4"}
        />,
      );
      const cardClickTarget = getByText("New");
      expect(cardClickTarget).toBeInTheDocument();
    }
  });
  test("new label is not visible on old units", () => {
    const math = subjects[3];
    if (math) {
      const { queryByText } = renderWithTheme(
        <SubjectListingCard
          subject={math}
          subjectSlug={"maths"}
          keyStageSlug={"ks4"}
          keyStageTitle={"Key stage 4"}
        />,
      );
      const cardClickTarget = queryByText("New");
      expect(cardClickTarget).not.toBeInTheDocument();
    }
  });

  test("calls tracking.subjectSelected once, with correct props", async () => {
    const { getByRole } = renderWithTheme(
      <SubjectListingCard
        subject={subjects[0]}
        subjectSlug={"maths"}
        keyStageSlug={"ks4"}
        keyStageTitle={"Key stage 4"}
      />,
    );
    const cardClickTarget = getByRole("link", {
      name: "Biology: 6 units, 35 lessons - new content",
    });

    const user = userEvent.setup();
    await user.click(cardClickTarget);

    expect(subjectSelected).toHaveBeenCalledTimes(1);
    expect(subjectSelected).toHaveBeenCalledWith({
      platform: "owa",
      product: "teacher lesson resources",
      engagementIntent: "refine",
      componentType: "subject_card",
      eventVersion: "2.0.0",
      analyticsUseCase: "Teacher",
      filterType: "Subject filter",
      filterValue: "biology",
      activeFilters: { keyStage: ["ks4"] },
    });
    expect(mockLinkClick).toHaveBeenCalledWith(
      "http://localhost/teachers/key-stages/ks4/subjects/biology/programmes",
    );
  });
});
