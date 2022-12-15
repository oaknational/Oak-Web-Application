import { screen } from "@testing-library/react";

import renderWithTheme from "../../__tests__/__helpers__/renderWithTheme";

import LessonResourceGraphics from "./LessonResourceGraphics";

describe("LessonResourceGraphics", () => {
  it("Renders correct titles ", () => {
    renderWithTheme(
      <LessonResourceGraphics
        items={[
          { title: "presentation", resourceCount: 1 },
          { title: "worksheet", resourceCount: 1 },
          { title: "quiz", resourceCount: 1 },
          { title: "video", resourceCount: 1 },
        ]}
      />
    );

    expect(screen.getByText("Presentation")).toBeInTheDocument();
    expect(screen.getByText("Worksheet")).toBeInTheDocument();
    expect(screen.getByText("Quiz")).toBeInTheDocument();
    expect(screen.getByText("Video")).toBeInTheDocument();
  });
  it("Renders correct titles when resources are missing ", () => {
    renderWithTheme(
      <LessonResourceGraphics
        items={[
          { title: "presentation", resourceCount: 1 },
          { title: "video", resourceCount: 1 },
        ]}
      />
    );

    expect(screen.getByText("Presentation")).toBeInTheDocument();
    expect(screen.queryByText("Worksheet")).toBeNull();
    expect(screen.queryByText("Quiz")).toBeNull();
    expect(screen.getByText("Video")).toBeInTheDocument();
  });
  it("Renders pluralized titles", () => {
    renderWithTheme(
      <LessonResourceGraphics
        items={[
          { title: "presentation", resourceCount: 4 },
          { title: "worksheet", resourceCount: 5 },
          { title: "quiz", resourceCount: 3 },
          { title: "video", resourceCount: 3 },
        ]}
      />
    );

    expect(screen.getByText("Presentations")).toBeInTheDocument();
    expect(screen.queryByText("Worksheets")).toBeInTheDocument();
    expect(screen.queryByText("Quizzes")).toBeInTheDocument();
    expect(screen.getByText("Videos")).toBeInTheDocument();
  });
  test("should render the resources as links", () => {
    const { getByText } = renderWithTheme(
      <LessonResourceGraphics
        items={[{ title: "presentation", resourceCount: 4 }]}
      />
    );

    expect(getByText("Presentations").closest("a")).toHaveAttribute(
      "href",
      "/"
    );
  });
});
