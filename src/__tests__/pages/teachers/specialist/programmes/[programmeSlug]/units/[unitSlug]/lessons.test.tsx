import { screen } from "@testing-library/dom";

import renderWithProviders from "@/__tests__/__helpers__/renderWithProviders";
import specialistLessonListingFixture from "@/components/TeacherViews/SpecialistLessonListing/SpecialistLessonListing.fixture";
import SpecialistLessonListing from "@/components/TeacherViews/SpecialistLessonListing/SpecialistLessonListing.view";
import { getStaticProps } from "@/pages/teachers/specialist/programmes/[programmeSlug]/units/[unitSlug]/lessons";
import curriculumApi from "@/node-lib/curriculum-api-2023";
import { topNavFixture } from "@/node-lib/curriculum-api-2023/fixtures/topNav.fixture";

const render = renderWithProviders();

describe("pages/specialist/programmes/[programmeSlug]/units/[unitSlug]", () => {
  it("renders lessons", () => {
    render(
      <SpecialistLessonListing
        curriculumData={specialistLessonListingFixture()}
      />,
    );

    const lessonCard = screen.getByText("Super juice");
    expect(lessonCard).toBeInTheDocument();
  });
});

jest.mock("@/node-lib/curriculum-api-2023", () => ({
  specialistLessonListing: jest.fn(),
  topNav: () => jest.fn().mockResolvedValue(topNavFixture)(),
}));

describe("getStaticProps", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetModules();
  });
  it("should return  404 page when there are no lessons", async () => {
    const result = await getStaticProps({
      params: { programmeSlug: "fake", unitSlug: "news" },
    });
    expect(result).toEqual({ notFound: true });
  });
  it("Should call the api", async () => {
    await getStaticProps({
      params: { programmeSlug: "numeracy", unitSlug: "numeracy 1" },
    });

    expect(curriculumApi.specialistLessonListing).toHaveBeenCalledTimes(1);
    expect(curriculumApi.specialistLessonListing).toHaveBeenCalledWith({
      programmeSlug: "numeracy",
      unitSlug: "numeracy 1",
    });
  });
  it("should fetch the data and return the props", async () => {
    const curriculumData = specialistLessonListingFixture();
    (curriculumApi.specialistLessonListing as jest.Mock).mockResolvedValue(
      curriculumData,
    );

    const result = await getStaticProps({
      params: { programmeSlug: "numeracy", unitSlug: "numeracy 1" },
    });

    expect(result).toEqual({
      props: {
        curriculumData,
        topNav: topNavFixture,
      },
    });
  });
});
