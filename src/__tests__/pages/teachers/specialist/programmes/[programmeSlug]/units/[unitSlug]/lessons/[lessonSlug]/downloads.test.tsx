import { screen } from "@testing-library/dom";

import renderWithProviders from "@/__tests__/__helpers__/renderWithProviders";
import curriculumApi from "@/node-lib/curriculum-api-2023";
import { SpecialistLessonDownloadFixture } from "@/node-lib/curriculum-api-2023/fixtures/specialistLessonDownloads.fixture";
import SpecialistLessonDownloadsPage, {
  getStaticProps,
} from "@/pages/teachers/specialist/programmes/[programmeSlug]/units/[unitSlug]/lessons/[lessonSlug]/downloads";
import { setUseUserReturn } from "@/__tests__/__helpers__/mockClerk";
import {
  mockLoggedIn,
  mockUserWithDownloadAccess,
  mockUserWithoutDownloadAccess,
} from "@/__tests__/__helpers__/mockUser";

const render = renderWithProviders();

describe("pages/specialist/programmes/[programmeSlug]/units/[unitSlug]/lessons/[lessonSlug]/downloads", () => {
  it("renders lessons", () => {
    render(
      <SpecialistLessonDownloadsPage
        curriculumData={SpecialistLessonDownloadFixture()}
      />,
    );

    const slidedeck = screen.getByText("Slide deck");
    expect(slidedeck).toBeInTheDocument();
  });
});

describe("when downloads are region restricted", () => {
  const curriculumData = SpecialistLessonDownloadFixture({
    geoRestricted: true,
  });

  describe("and the user has access", () => {
    beforeEach(() => {
      setUseUserReturn({
        ...mockLoggedIn,
        user: mockUserWithDownloadAccess,
      });
    });

    it("allows downloads", () => {
      render(<SpecialistLessonDownloadsPage curriculumData={curriculumData} />);

      expect(
        screen.queryByText(
          "Sorry, downloads for this lesson are not available in your country",
        ),
      ).not.toBeInTheDocument();
    });
  });

  describe("and the user does not have access", () => {
    beforeEach(() => {
      setUseUserReturn({
        ...mockLoggedIn,
        user: mockUserWithoutDownloadAccess,
      });
    });

    // TODO: reinstate when geoblocking live
    it.skip("disallows downloads", () => {
      render(<SpecialistLessonDownloadsPage curriculumData={curriculumData} />);

      expect(
        screen.queryByText(
          "Sorry, downloads for this lesson are not available in your country",
        ),
      ).toBeInTheDocument();
    });
  });
});

jest.mock("@/node-lib/curriculum-api-2023", () => ({
  specialistLessonDownloads: jest.fn(),
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

    expect(curriculumApi.specialistLessonDownloads).toHaveBeenCalledTimes(1);
    expect(curriculumApi.specialistLessonDownloads).toHaveBeenCalledWith({
      programmeSlug: "numeracy",
      unitSlug: "numeracy 1",
      lessonSlug: "first lesson",
    });
  });
  it("should fetch the data and return the props", async () => {
    const curriculumData = SpecialistLessonDownloadFixture();
    (curriculumApi.specialistLessonDownloads as jest.Mock).mockResolvedValue(
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
