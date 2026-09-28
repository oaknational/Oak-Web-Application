import { screen } from "@testing-library/dom";
import userEvent from "@testing-library/user-event";

import { TeachWithOakHeader } from "./TeachWithOakHeader";

import renderWithProviders from "@/__tests__/__helpers__/renderWithProviders";

const render = renderWithProviders();

const mockLessonAccessed = jest.fn();
jest.mock("@/context/Analytics/useAnalytics", () => ({
  __esModule: true,
  default: () => ({
    track: {
      lessonAccessed: (...args: unknown[]) => mockLessonAccessed(...args),
    },
  }),
}));

jest.mock("next/navigation", () => ({
  usePathname: jest.fn(),
  useSearchParams: jest.fn().mockReturnValue(
    new URLSearchParams({
      returnTo:
        "/teachers/programmes/art-primary-ks1/units/unit-slug/lessons/lesson-slug",
      lessonName: "Lesson name",
      unitName: "Unit name",
    }),
  ),
}));

describe("TeachWithOakHeader", () => {
  it("renders correctly", () => {
    const { baseElement, getByRole } = render(<TeachWithOakHeader />);

    expect(baseElement).toMatchSnapshot();
    expect(getByRole("heading")).toHaveTextContent(
      "The thinking behind Oak lessons",
    );
    expect(baseElement).toHaveTextContent(
      "See how our lessons are designed to support learning - and make the most of them in your classroom.",
    );
  });
  it("calls lessonAccessed on back to lesson click", async () => {
    render(<TeachWithOakHeader />);

    const backToLessonLink = screen.getByRole("link", {
      name: "Back to lesson",
    });
    expect(backToLessonLink).toHaveAttribute(
      "href",
      "/teachers/programmes/art-primary-ks1/units/unit-slug/lessons/lesson-slug",
    );
    const user = userEvent.setup();
    backToLessonLink.addEventListener("click", (e) => e.preventDefault());
    await user.click(backToLessonLink);
    expect(mockLessonAccessed).toHaveBeenCalledWith(
      expect.objectContaining({
        lessonName: "Lesson name",
        unitName: "Unit name",
      }),
    );
  });
});
