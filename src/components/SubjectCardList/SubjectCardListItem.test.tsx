import { screen } from "@testing-library/react";

import renderWithTheme from "../../__tests__/__helpers__/renderWithTheme";

import SubjectCardListItem from "./SubjectCardListItem";

describe("SubjectCardListItem", () => {
  test("render a Card with the Name of the Subject", () => {
    renderWithTheme(
      <SubjectCardListItem
        titleTag={"h3"}
        title={"Art and Design"}
        lessonCount={130}
        unitCount={14}
        keyStageSlug={"keyStage"}
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
        unitCount={14}
        keyStageSlug={"keyStage"}
        slug={"art"}
        tierCount={null}
      />
    );
    const cardClickTarget = getByRole("link", {
      name: "Art and Design",
    });
    expect(cardClickTarget).toBeInTheDocument();
  });
});
