import { screen } from "@testing-library/react";

import { TeachWithOakDownloadSuccessView } from "./TeachWithOakDownloadSuccessView";

import curriculumPhaseOptions from "@/browser-lib/fixtures/curriculumPhaseOptions";
import renderWithProviders from "@/__tests__/__helpers__/renderWithProviders";

const render = renderWithProviders();

const mockReturnToLessonProps = jest.fn().mockReturnValue(undefined);
jest.mock("../../../getReturnToLessonLink", () => ({
  useReturnToLessonProps: () => mockReturnToLessonProps(),
}));

const returnTo =
  "/teachers/programmes/art-primary-ks1/units/unitSlug/lessons/lessonSlug";

describe("TeachWithOakDownloadSuccessView", () => {
  beforeEach(() => {
    mockReturnToLessonProps.mockReturnValue(undefined);
  });

  it("renders the download success header without the font instructions", () => {
    render(
      <TeachWithOakDownloadSuccessView
        curriculumPhaseOptions={curriculumPhaseOptions}
      />,
    );

    expect(
      screen.getByRole("heading", { name: "Thanks for downloading!" }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("link", {
        name: /install the Google Fonts 'Lexend' and 'Kalam'/,
      }),
    ).not.toBeInTheDocument();
  });

  it("shows the back to lesson link when a lesson is in the returnTo param", () => {
    mockReturnToLessonProps.mockReturnValue({
      returnTo,
      lessonName: "Lesson Name",
      unitName: "Unit Name",
    });

    render(
      <TeachWithOakDownloadSuccessView
        curriculumPhaseOptions={curriculumPhaseOptions}
      />,
    );

    expect(
      screen.getByRole("link", { name: "Back to lesson" }),
    ).toHaveAttribute("href", returnTo);
    expect(screen.queryByRole("navigation")).not.toBeInTheDocument();
  });

  it("shows the subject phase picker when there is no back to lesson link", () => {
    render(
      <TeachWithOakDownloadSuccessView
        curriculumPhaseOptions={curriculumPhaseOptions}
      />,
    );

    expect(
      screen.queryByRole("link", { name: "Back to lesson" }),
    ).not.toBeInTheDocument();
    expect(
      screen.getByRole("heading", {
        name: "Explore curriculum plans and teaching resources",
      }),
    ).toBeInTheDocument();
    expect(screen.getByRole("navigation")).toBeVisible();
  });
});
