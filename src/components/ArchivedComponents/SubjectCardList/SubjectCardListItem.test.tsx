import { screen } from "@testing-library/react";

import renderWithTheme from "../../../__tests__/__helpers__/renderWithTheme";

import { KeyStageSubject } from "./SubjectCardList";
import SubjectCardListItem from "./SubjectCardListItem";

const subjectCardListItemProps: KeyStageSubject = [
  {
    subjectSlug: "biology",
    subjectTitle: "Biology",
    lessonCount: 4,
    unitCount: 1,
    programmeSlug: "biology-secondary-ks4",
    programmeCount: 2,
  },
];

const subjectSelected = jest.fn();
jest.mock("@/context/Analytics/useAnalytics", () => ({
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
        isAvailable={true}
        subject={subjectCardListItemProps}
        keyStageSlug={"ks4"}
        keyStageTitle={"Key stage 4"}
      />,
    );
    expect(screen.getByText("Biology")).toBeInTheDocument();
  });
  test("if available has a link to take you to the corresponding subject page", () => {
    const { getByRole } = renderWithTheme(
      <SubjectCardListItem
        titleTag="h3"
        subject={subjectCardListItemProps}
        keyStageSlug={"ks4"}
        keyStageTitle={"Key stage 4"}
        isAvailable={true}
      />,
    );
    const cardClickTarget = getByRole("link", {
      name: "Biology",
    });
    expect(cardClickTarget).toBeInTheDocument();
  });
});
