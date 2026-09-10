import { screen } from "@testing-library/react";

import { TeachWithOakView } from "./TeachWithOakView";

import renderWithProviders from "@/__tests__/__helpers__/renderWithProviders";

const render = renderWithProviders();

describe("TeachWithOakView", () => {
  it("renders the lesson guidance and learning cycle content", () => {
    render(<TeachWithOakView />);

    expect(
      screen.getByRole("heading", {
        name: "The thinking behind Oak lessons",
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", {
        name: "There's a lot of thinking behind every Oak lesson",
      }),
    ).toBeInTheDocument();

    ["Explanation", "Check for understanding", "Practice", "Feedback"].forEach(
      (learningCycle) => {
        expect(
          screen.getByRole("heading", { name: learningCycle }),
        ).toBeInTheDocument();
      },
    );
  });

  it("renders links to further Oak guidance", () => {
    render(<TeachWithOakView />);

    expect(
      screen.getByRole("heading", { name: "Explore more guidance from Oak" }),
    ).toBeInTheDocument();

    ["Plan a lesson", "Blogs", "Webinars", "Help"].forEach((linkName) => {
      expect(screen.getByRole("link", { name: linkName })).toHaveAttribute(
        "href",
      );
    });
  });

  it("renders a return link only when one is supplied", () => {
    const { rerender } = render(<TeachWithOakView />);

    expect(
      screen.queryByRole("link", { name: "Back to lesson" }),
    ).not.toBeInTheDocument();

    rerender(<TeachWithOakView backToLessonLink="/teachers/lessons/example" />);

    expect(
      screen.getByRole("link", { name: "Back to lesson" }),
    ).toHaveAttribute("href", "/teachers/lessons/example");
  });
});
