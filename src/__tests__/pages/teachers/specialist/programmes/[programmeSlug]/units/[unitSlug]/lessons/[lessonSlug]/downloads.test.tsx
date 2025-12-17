import { screen } from "@testing-library/dom";

import renderWithProviders from "@/__tests__/__helpers__/renderWithProviders";
import { SpecialistLessonDownloadFixture } from "@/node-lib/curriculum-api-2023/fixtures/specialistLessonDownloads.fixture";
import SpecialistLessonDownloadsPage, {
  getStaticProps,
} from "@/pages/teachers/specialist/programmes/[programmeSlug]/units/[unitSlug]/lessons/[lessonSlug]/downloads";
import { setUseUserReturn } from "@/__tests__/__helpers__/mockClerk";
import {
  mockLoggedIn,
  mockUserWithDownloadAccess,
} from "@/__tests__/__helpers__/mockUser";
import { topNavFixture } from "@/node-lib/curriculum-api-2023/fixtures/topNav.fixture";

const render = renderWithProviders();

describe("pages/specialist/programmes/[programmeSlug]/units/[unitSlug]/lessons/[lessonSlug]/downloads", () => {
  it("renders lessons", () => {
    render(
      <SpecialistLessonDownloadsPage
        curriculumData={SpecialistLessonDownloadFixture()}
        topNav={topNavFixture}
      />,
    );

    const slidedeck = screen.getByText("Lesson slides");
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
      render(
        <SpecialistLessonDownloadsPage
          curriculumData={curriculumData}
          topNav={topNavFixture}
        />,
      );

      expect(
        screen.queryByText(
          "Sorry, downloads for this lesson are not available in your country",
        ),
      ).not.toBeInTheDocument();
    });
  });
});

const mockSpecialistDownloads = jest
  .fn()
  .mockResolvedValue(SpecialistLessonDownloadFixture());

const mockTopNav = jest.fn().mockResolvedValue(topNavFixture);

jest.mock("@/node-lib/curriculum-api-2023", () => ({
  __esModule: true,
  default: {
    topNav: () => mockTopNav(),
    specialistLessonDownloads: () => mockSpecialistDownloads(),
  },
}));

describe("getStaticProps", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetModules();
  });

  it("Should call the api", async () => {
    await getStaticProps({
      params: {
        programmeSlug: "numeracy",
        unitSlug: "numeracy 1",
        lessonSlug: "first lesson",
      },
    });

    expect(mockSpecialistDownloads).toHaveBeenCalledTimes(1);
  });
  it("should fetch the data and return the props", async () => {
    const result = await getStaticProps({
      params: {
        programmeSlug: "numeracy",
        unitSlug: "numeracy 1",
        lessonSlug: "first lesson",
      },
    });

    expect(result).toEqual({
      props: {
        curriculumData: SpecialistLessonDownloadFixture(),
        topNav: topNavFixture,
      },
    });
  });
  it("should return  404 page when there are no downloads", async () => {
    mockSpecialistDownloads.mockResolvedValue(null);
    const result = await getStaticProps({
      params: { programmeSlug: "fake", unitSlug: "news", lessonSlug: "blah" },
    });
    expect(result).toEqual({ notFound: true });
  });
});
