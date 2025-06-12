import { screen } from "@testing-library/react";
import { GetStaticPropsContext, PreviewData } from "next";

import renderWithSeo from "@/__tests__/__helpers__/renderWithSeo";
import { mockSeoResult } from "@/__tests__/__helpers__/cms";
import renderWithProviders from "@/__tests__/__helpers__/renderWithProviders";
import specialistLessonOverviewFixture from "@/node-lib/curriculum-api-2023/fixtures/specialistLessonOverview.fixture";
import SpecialistLessonOverviewPage, {
  getStaticProps,
  URLParams,
} from "@/pages/teachers/specialist/programmes/[programmeSlug]/units/[unitSlug]/lessons/[lessonSlug]";
import { setUseUserReturn } from "@/__tests__/__helpers__/mockClerk";
import {
  mockLoggedIn,
  mockUserWithDownloadAccess,
} from "@/__tests__/__helpers__/mockUser";

const props = {
  curriculumData: specialistLessonOverviewFixture(),
};

const downloadResourceButtonClicked = jest.fn();
const lessonShareStarted = jest.fn();

jest.mock("@/context/Analytics/useAnalytics", () => ({
  __esModule: true,
  default: () => ({
    track: {
      downloadResourceButtonClicked: (...args: []) =>
        downloadResourceButtonClicked(...args),
      lessonShareStarted: (...args: []) => lessonShareStarted(...args),
    },
  }),
}));

const render = renderWithProviders();

describe("pages/teachers/specialist/programmes/units/[unitSlug]/lessons/[lessonSlug]", () => {
  beforeEach(() => {
    setUseUserReturn({
      ...mockLoggedIn,
      user: mockUserWithDownloadAccess,
    });
  });

  it("Renders title from the props", async () => {
    render(<SpecialistLessonOverviewPage {...props} />);

    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      "Composition: Following a Recipe",
    );
  });

  it("renders Download All button if lesson has downloadable resources", async () => {
    render(
      <SpecialistLessonOverviewPage
        curriculumData={specialistLessonOverviewFixture({})}
      />,
    );

    expect(screen.getAllByTestId("download-all-button")[0]).toHaveTextContent(
      "Download all resources",
    );
  });

  it("does not render Download All button if lesson has no downloadable resources", async () => {
    render(
      <SpecialistLessonOverviewPage
        curriculumData={specialistLessonOverviewFixture({
          expired: false,
          downloads: [],
        })}
      />,
    );

    expect(screen.queryByTestId("download-all-button")).not.toBeInTheDocument();
  });

  it("does not render Download All button if lesson is expired", async () => {
    render(
      <SpecialistLessonOverviewPage
        curriculumData={specialistLessonOverviewFixture({
          expired: true,
        })}
      />,
    );

    expect(screen.queryByTestId("download-all-button")).not.toBeInTheDocument();
  });

  it("renders an iframe for a presentation and worksheet", async () => {
    const { getAllByTestId } = render(
      <SpecialistLessonOverviewPage {...props} />,
    );
    const iframeElement = getAllByTestId("overview-presentation");
    expect(iframeElement.length).toEqual(2);
  });

  describe("SEO", () => {
    it("renders the correct SEO details", async () => {
      const { seo } = renderWithSeo()(
        <SpecialistLessonOverviewPage {...props} />,
      );

      expect(seo).toEqual({
        ...mockSeoResult,
        ogSiteName: "NEXT_PUBLIC_SEO_APP_NAME",
        title:
          "Lesson: Composition: Following a Recipe | APPLYING LEARNING Communication and language | NEXT_PUBLIC_SEO_APP_NAME",
        description: "Overview of lesson",
        ogTitle:
          "Lesson: Composition: Following a Recipe | APPLYING LEARNING Communication and language | NEXT_PUBLIC_SEO_APP_NAME",
        ogDescription: "Overview of lesson",
        ogUrl: "NEXT_PUBLIC_SEO_APP_URL/",
        canonical: "NEXT_PUBLIC_SEO_APP_URL",
        robots: "noindex,nofollow",
      });
    });
  });

  describe("getStaticProps", () => {
    it("should throw error", async () => {
      await expect(
        getStaticProps({} as GetStaticPropsContext<URLParams, PreviewData>),
      ).rejects.toThrowError("No context.params");
    });
  });
});
