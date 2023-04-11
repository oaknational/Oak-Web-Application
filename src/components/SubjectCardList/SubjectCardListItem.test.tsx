import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import renderWithTheme from "../../__tests__/__helpers__/renderWithTheme";

import SubjectCardListItem from "./SubjectCardListItem";

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
        titleTag={"h3"}
        title={"Art and Design"}
        lessonCount={130}
        activeUnitCount={14}
        keyStageSlug={"keyStage"}
        keyStageTitle={"Key stage 1"}
        slug={"art"}
        tierCount={null}
      />
    );
    expect(screen.getByText("Art and Design")).toBeInTheDocument();
  });
  test("if available has a link to take you to the corresponding subject page", () => {
    const { getByRole } = renderWithTheme(
      <SubjectCardListItem
        titleTag={"h3"}
        title={"Art and Design"}
        lessonCount={130}
        activeUnitCount={14}
        keyStageSlug={"keyStage"}
        keyStageTitle={"Key stage 1"}
        slug={"art"}
        tierCount={null}
      />
    );
    const cardClickTarget = getByRole("link", {
      name: "Art and Design",
    });
    expect(cardClickTarget).toBeInTheDocument();
  });
  test("calls tracking.keyStageSelected once, with correct props", async () => {
    const { getByRole } = renderWithTheme(
      <SubjectCardListItem
        titleTag={"h3"}
        title={"Art and Design"}
        lessonCount={130}
        activeUnitCount={14}
        keyStageSlug={"ks1"}
        keyStageTitle={"Key stage 1"}
        slug={"art"}
        tierCount={null}
      />
    );
    const cardClickTarget = getByRole("link", {
      name: "Art and Design",
    });

    const user = userEvent.setup();
    await user.click(cardClickTarget);

    expect(subjectSelected).toHaveBeenCalledTimes(1);
    expect(subjectSelected).toHaveBeenCalledWith({
      keyStageTitle: "Key stage 1",
      keyStageSlug: "ks1",
      subjectTitle: "Art and Design",
      subjectSlug: "art",
      analyticsUseCase: ["Teacher"],
    });
  });
});
