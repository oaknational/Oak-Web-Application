import { screen } from "@testing-library/react";

import renderWithTheme from "../../__tests__/__helpers__/renderWithTheme";

import SubjectCardLink from "./SubjectCardLink";

describe("SubjectCardLink", () => {
  test("render a Card with the Name of the Subject", () => {
    renderWithTheme(
      <SubjectCardLink
        svgName="SubjectArtAndDesign"
        titleTag={"h3"}
        title={"Art and Design"}
        imageBackground={"teachersPastelYellow"}
        background={"white"}
        lessonCount={130}
        unitCount={14}
        available={false}
        keyStageSlug={"keyStage"}
        slug={"subject"}
      />
    );
    expect(screen.getByText("Art and Design")).toBeInTheDocument();
  });
  test("if available has a link to take you to the corresponding subject page", () => {
    const { getByRole } = renderWithTheme(
      <SubjectCardLink
        svgName="SubjectArtAndDesign"
        titleTag={"h3"}
        title={"Art and Design"}
        imageBackground={"teachersPastelYellow"}
        background={"white"}
        lessonCount={130}
        unitCount={14}
        available={true}
        keyStageSlug={"keyStage"}
        slug={"subject"}
      />
    );
    const cardClickTarget = getByRole("link", {
      name: "Art and Design",
    });
    expect(cardClickTarget).toBeInTheDocument();
  });
});
