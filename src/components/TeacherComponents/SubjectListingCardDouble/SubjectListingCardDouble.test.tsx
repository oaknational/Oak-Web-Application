import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import SubjectListingCardDouble from "./SubjectListingCardDouble";

import { Subjects } from "@/pages/teachers/key-stages/[keyStageSlug]/subjects";
import renderWithTheme from "@/__tests__/__helpers__/renderWithTheme";
import subjectPagePropsFixture from "@/node-lib/curriculum-api/fixtures/subjectPageProps";

const subjects: Subjects = subjectPagePropsFixture().subjects;

const subjectSelected = jest.fn();
jest.mock("@/context/Analytics/useAnalytics", () => ({
  __esModule: true,
  default: () => ({
    track: {
      subjectSelected: (...args: unknown[]) => subjectSelected(...args),
    },
  }),
}));

describe("SubjectListingCardDouble", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("render a Card with the Name of the Subject", () => {
    renderWithTheme(
      <SubjectListingCardDouble
        subject={subjects[0] as Subjects[number]}
        subjectSlug={"biology"}
        keyStageSlug={"ks4"}
        keyStageTitle={"Key stage 4"}
      />,
    );
    expect(screen.getByText("Biology")).toBeInTheDocument();
  });
  test("old units with 1 programme take you to 'teachers' view unit listing page", () => {
    const { getByRole } = renderWithTheme(
      <SubjectListingCardDouble
        subject={subjects[0] as Subjects[number]}
        subjectSlug={"biology"}
        keyStageSlug={"ks4"}
        keyStageTitle={"Key stage 4"}
      />,
    );
    const cardClickTarget = getByRole("link", {
      name: "Biology: 1 unit, 6 lessons",
    });
    expect(cardClickTarget).toBeInTheDocument();
    expect(cardClickTarget).toHaveAttribute(
      "href",
      "/teachers/programmes/biology-secondary-ks4/units",
    );
  });
  test("old units with more than one programme take you to 'teachers' view programme listing page", () => {
    const { getByRole } = renderWithTheme(
      <SubjectListingCardDouble
        subject={subjects[1] as Subjects[number]}
        subjectSlug={"maths"}
        keyStageSlug={"ks4"}
        keyStageTitle={"Key stage 4"}
      />,
    );
    const cardClickTarget = getByRole("link", {
      name: "Maths: 1 unit, 6 lessons",
    });
    expect(cardClickTarget).toBeInTheDocument();
    expect(cardClickTarget).toHaveAttribute(
      "href",
      "/teachers/key-stages/ks4/subjects/maths/programmes",
    );
  });
  test("new units with 1 programme take you to 'teachers' view unit listing page", () => {
    const { getByRole } = renderWithTheme(
      <SubjectListingCardDouble
        subject={subjects[0] as Subjects[number]}
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
  test("new units with more than one programme take you to 'teachers' view programme listing page", () => {
    const { getByRole } = renderWithTheme(
      <SubjectListingCardDouble
        subject={subjects[1] as Subjects[number]}
        subjectSlug={"maths"}
        keyStageSlug={"ks4"}
        keyStageTitle={"Key stage 4"}
      />,
    );
    const cardClickTarget = getByRole("link", {
      name: "Maths: 6 units, 35 lessons - new content",
    });
    expect(cardClickTarget).toBeInTheDocument();
    expect(cardClickTarget).toHaveAttribute(
      "href",
      "/teachers/programmes/biology-secondary-ks4/units",
    );
  });
  test("new units are labeled as 'new'", () => {
    const { getByText } = renderWithTheme(
      <SubjectListingCardDouble
        subject={subjects[2] as Subjects[number]}
        subjectSlug={"maths"}
        keyStageSlug={"ks4"}
        keyStageTitle={"Key stage 4"}
      />,
    );
    const cardClickTarget = getByText("New");
    expect(cardClickTarget).toBeInTheDocument();
  });
  test("new label is not visible on old units", () => {
    const { queryByText } = renderWithTheme(
      <SubjectListingCardDouble
        subject={subjects[3] as Subjects[number]}
        subjectSlug={"maths"}
        keyStageSlug={"ks4"}
        keyStageTitle={"Key stage 4"}
      />,
    );
    const cardClickTarget = queryByText("New");
    expect(cardClickTarget).not.toBeInTheDocument();
  });

  test("calls tracking.subjectSelected once, with correct props", async () => {
    const { getByRole } = renderWithTheme(
      <SubjectListingCardDouble
        subject={subjects[0] as Subjects[number]}
        subjectSlug={"maths"}
        keyStageSlug={"ks4"}
        keyStageTitle={"Key stage 4"}
      />,
    );
    const cardClickTarget = getByRole("link", {
      name: "Biology: 1 unit, 6 lessons",
    });

    const user = userEvent.setup();
    await user.click(cardClickTarget);

    expect(subjectSelected).toHaveBeenCalledTimes(1);
    expect(subjectSelected).toHaveBeenCalledWith({
      keyStageSlug: "ks4",
      keyStageTitle: "Key stage 4",
      subjectSlug: "biology",
      subjectTitle: "Biology",
      analyticsUseCase: null,
    });
  });
});
