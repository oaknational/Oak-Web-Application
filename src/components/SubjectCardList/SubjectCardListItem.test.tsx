import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { ProgrammesBySubject } from "../../pages/beta/teachers/key-stages/[keyStageSlug]/subjects";
import renderWithTheme from "../../__tests__/__helpers__/renderWithTheme";

import SubjectCardListItem from "./SubjectCardListItem";

const subjectCardListemProps: ProgrammesBySubject = [
  {
    slug: "biology",
    title: "Biology",
    keyStageSlug: "ks4",
    keyStageTitle: "Key stage 4",
    totalUnitCount: 1,
    activeLessonCount: 3,
    programmeSlug: "biology-secondary-ks4",
    tierSlug: null,
  },
];

const subjectTrackingProps: ProgrammesBySubject = [
  {
    slug: "combined-science",
    title: "Combined Science",
    keyStageSlug: "ks4",
    keyStageTitle: "Key stage 4",
    totalUnitCount: 2,
    activeLessonCount: 4,
    programmeSlug: "combined-science-secondary-ks4-foundation",
    tierSlug: "foundation",
  },
  {
    slug: "combined-science",
    title: "Combined Science",
    keyStageSlug: "ks4",
    keyStageTitle: "Key stage 4",
    totalUnitCount: 2,
    activeLessonCount: 6,
    programmeSlug: "combined-science-secondary-ks4-higher",
    tierSlug: "higher",
  },
];

const subjectSelected = jest.fn();
jest.mock("../../context/Analytics/useAnalytics", () => ({
  __esModule: true,
  default: () => ({
    track: {
      subjectSelected: (...args: unknown[]) => subjectSelected(...args),
    },
  }),
}));

describe("SubjectCardListItem", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("render a Card with the Name of the Subject", () => {
    renderWithTheme(
      <SubjectCardListItem
        titleTag="h3"
        programmes={subjectCardListemProps}
        isAvailable={true}
      />
    );
    expect(screen.getByText("Biology")).toBeInTheDocument();
  });
  test("if available has a link to take you to the corresponding subject page", () => {
    const { getByRole } = renderWithTheme(
      <SubjectCardListItem
        titleTag="h3"
        programmes={subjectCardListemProps}
        isAvailable={true}
      />
    );
    const cardClickTarget = getByRole("link", {
      name: "Biology",
    });
    expect(cardClickTarget).toBeInTheDocument();
  });
  test("calls tracking.keyStageSelected once, with correct props", async () => {
    const { getByRole } = renderWithTheme(
      <SubjectCardListItem
        titleTag="h3"
        programmes={subjectTrackingProps}
        isAvailable={true}
      />
    );
    const cardClickTarget = getByRole("link", {
      name: "Combined Science",
    });

    const user = userEvent.setup();
    await user.click(cardClickTarget);

    expect(subjectSelected).toHaveBeenCalledTimes(1);
    expect(subjectSelected).toHaveBeenCalledWith({
      keyStageSlug: "ks4",
      keyStageTitle: "Key stage 4",
      subjectSlug: "combined-science",
      subjectTitle: "Combined Science",
      analyticsUseCase: ["Teacher"],
    });
  });
});
