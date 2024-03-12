import { screen } from "@testing-library/dom";

import renderWithProviders from "@/__tests__/__helpers__/renderWithProviders";
import curriculumApi from "@/node-lib/curriculum-api-2023";
import SpecialistLessonSharePage, {
  getStaticProps,
} from "@/pages/teachers/specialist/programmes/[programmeSlug]/units/[unitSlug]/lessons/[lessonSlug]/share";
import { SpecialistLessonShareFixture } from "@/node-lib/curriculum-api-2023/fixtures/specialistLessonShare.fixture";

const render = renderWithProviders();

describe("pages/specialist/programmes/[programmeSlug]/units/[unitSlug]/lessons/[lessonSlug]/share", () => {
  it("renders shareable resource", () => {
    render(
      <SpecialistLessonSharePage
        curriculumData={SpecialistLessonShareFixture()}
      />,
    );

    const videoCard = screen.getByText("Video");
    expect(videoCard).toBeInTheDocument();
  });
});

jest.mock("@/node-lib/curriculum-api-2023", () => ({
  specialistLessonShare: jest.fn(),
}));

describe("getStaticProps", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetModules();
  });
  it("should return  404 page when there are no downloads", async () => {
    const result = await getStaticProps({
      params: { programmeSlug: "fake", unitSlug: "news", lessonSlug: "blah" },
    });
    expect(result).toEqual({ notFound: true });
  });
  it("Should call the api", async () => {
    await getStaticProps({
      params: {
        programmeSlug: "numeracy",
        unitSlug: "numeracy 1",
        lessonSlug: "first lesson",
      },
    });

    expect(curriculumApi.specialistLessonShare).toHaveBeenCalledTimes(1);
    expect(curriculumApi.specialistLessonShare).toHaveBeenCalledWith({
      programmeSlug: "numeracy",
      unitSlug: "numeracy 1",
      lessonSlug: "first lesson",
    });
  });
  it("should fetch the data and return the props", async () => {
    const curriculumData = SpecialistLessonShareFixture();
    (curriculumApi.specialistLessonShare as jest.Mock).mockResolvedValue(
      curriculumData,
    );

    const result = await getStaticProps({
      params: {
        programmeSlug: "numeracy",
        unitSlug: "numeracy 1",
        lessonSlug: "first lesson",
      },
    });

    expect(result).toEqual({
      props: {
        curriculumData,
      },
    });
  });
});
