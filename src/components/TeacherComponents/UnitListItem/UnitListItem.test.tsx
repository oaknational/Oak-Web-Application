import { describe, expect, it } from "vitest";
import { act, screen } from "@testing-library/react";

import UnitListItem from "./UnitListItem";

import renderWithProviders from "@/__tests__/__helpers__/renderWithProviders";

const onClick = vi.fn();

const props = {
  title: "Numbers and numerals",
  nullTitle: "Numbers and numerals",
  slug: "numbers-and-numerals",
  themeTitle: "Circles",
  themeSlug: "circles",
  lessonCount: 5,
  index: 3,
  expired: false,
  expiredLessonCount: 2,
  subjectSlug: "maths",
  subjectTitle: "Maths",
  keyStageSlug: "ks1",
  keyStageTitle: "Key stage 1",
  quizCount: 3,
  programmeSlug: "maths--primary-ks1-l",
  hitCount: 10,
  currentPage: 1,
  yearTitle: "Year 1",
  onClick: onClick,
  learningThemes: [
    {
      themeTitle: "Circles",
      themeSlug: "circles",
    },
  ],
};

const render = renderWithProviders();

describe("Unit List Item", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("It uses singular  form of lesson", () => {
    const singular = Object.assign({}, props);
    singular.lessonCount = 1;
    singular.expiredLessonCount = 0;
    render(<UnitListItem {...singular} />);

    const lessonCountText = screen.getByText("1 lesson");
    expect(lessonCountText).toBeInTheDocument();
  });

  it("It uses plural form of lessons", () => {
    const plural = Object.assign({}, props);
    plural.expiredLessonCount = 0;
    render(<UnitListItem {...plural} />);

    const lessonCountText = screen.getByText("5 lessons");
    expect(lessonCountText).toBeInTheDocument();
  });

  it("It calls onClick with correct props when clicked", async () => {
    const { getByText } = render(<UnitListItem {...props} />);

    const unit = getByText("Numbers and numerals");

    act(() => {
      unit.click();
    });

    expect(onClick).toHaveBeenCalledTimes(1);

    expect(onClick).toHaveBeenCalledWith({
      ...props,
    });
  });
});
