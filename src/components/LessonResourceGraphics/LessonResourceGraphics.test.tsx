import { screen } from "@testing-library/react";

import renderWithTheme from "../../__tests__/__helpers__/renderWithTheme";

import LessonResourceGraphics from "./LessonResourceGraphics";

describe("LessonResourceGraphics", () => {
  it("Renders correct titles ", () => {
    renderWithTheme(
      <LessonResourceGraphics
        items={[
          { title: "slidedeck", resourceCount: 1 },
          { title: "worksheet", resourceCount: 1 },
          { title: "quiz", resourceCount: 1 },
          { title: "video", resourceCount: 1 },
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
          { title: "slidedeck", resourceCount: 1 },
          { title: "video", resourceCount: 1 },
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
          { title: "slidedeck", resourceCount: 4 },
          { title: "worksheet", resourceCount: 5 },
          { title: "quiz", resourceCount: 3 },
          { title: "video", resourceCount: 3 },
        ]}
      />
    );

    expect(screen.getByText("4 Slide decks")).toBeInTheDocument();
    expect(screen.queryByText("5 Worksheets")).toBeInTheDocument();
    expect(screen.queryByText("3 Quizzes")).toBeInTheDocument();
    expect(screen.getByText("3 Videos")).toBeInTheDocument();
  });
});
