import { screen } from "@testing-library/react";

import renderWithTheme from "../../__tests__/__helpers__/renderWithTheme";

import LessonResourceGraphics from "./LessonResourceGraphics";

describe("LessonResourceGraphics", () => {
  it("Renders correct titles ", () => {
    renderWithTheme(
      <LessonResourceGraphics
        items={[
          {
            titleSingular: "Slide deck",
            titlePlural: "Slide decks",
            icon: "slide-deck",
            resourceCount: 1,
          },
          {
            titleSingular: "Worksheet",
            titlePlural: "Worksheets",
            icon: "worksheet",
            resourceCount: 1,
          },
          {
            titleSingular: "Quiz",
            titlePlural: "Quizzes",
            icon: "quiz",
            resourceCount: 1,
          },
          {
            titleSingular: "Video",
            titlePlural: "Videos",
            icon: "video",
            resourceCount: 1,
          },
        ]}
      />
    );

    expect(screen.getByText("1 Slide deck")).toBeInTheDocument();
    expect(screen.getByText("1 Worksheet")).toBeInTheDocument();
    expect(screen.getByText("1 Quiz")).toBeInTheDocument();
    expect(screen.getByText("1 Video")).toBeInTheDocument();
  });
  it("Renders correct titles when resources are missing ", () => {
    renderWithTheme(
      <LessonResourceGraphics
        items={[
          {
            titleSingular: "Slide deck",
            titlePlural: "Slide decks",
            icon: "slide-deck",
            resourceCount: 1,
          },
          {
            titleSingular: "Video",
            titlePlural: "Videos",
            icon: "video",
            resourceCount: 1,
          },
        ]}
      />
    );

    expect(screen.getByText("1 Slide deck")).toBeInTheDocument();
    expect(screen.queryByText("1 Worksheet")).toBeNull();
    expect(screen.queryByText("1 Quiz")).toBeNull();
    expect(screen.getByText("1 Video")).toBeInTheDocument();
  });
  it("Renders pluralized titles", () => {
    renderWithTheme(
      <LessonResourceGraphics
        items={[
          {
            titleSingular: "Slide deck",
            titlePlural: "Slide decks",
            icon: "slide-deck",
            resourceCount: 4,
          },
          {
            titleSingular: "Worksheet",
            titlePlural: "Worksheets",
            icon: "worksheet",
            resourceCount: 5,
          },
          {
            titleSingular: "Quiz",
            titlePlural: "Quizzes",
            icon: "quiz",
            resourceCount: 3,
          },
          {
            titleSingular: "Video",
            titlePlural: "Videos",
            icon: "video",
            resourceCount: 3,
          },
        ]}
      />
    );

    expect(screen.getByText("4 Slide decks")).toBeInTheDocument();
    expect(screen.queryByText("5 Worksheets")).toBeInTheDocument();
    expect(screen.queryByText("3 Quizzes")).toBeInTheDocument();
    expect(screen.getByText("3 Videos")).toBeInTheDocument();
  });
});
