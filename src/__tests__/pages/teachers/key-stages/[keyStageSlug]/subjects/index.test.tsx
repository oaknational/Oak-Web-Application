import { screen, waitFor } from "@testing-library/react";

import SubjectListingPage, {
  SubjectListingPageProps,
  getStaticPaths,
  getStaticProps,
} from "@/pages/teachers/key-stages/[keyStageSlug]/subjects";
import { mockSeoResult } from "@/__tests__/__helpers__/cms";
import renderWithSeo from "@/__tests__/__helpers__/renderWithSeo";
import renderWithProviders from "@/__tests__/__helpers__/renderWithProviders";
import curriculumApi from "@/node-lib/curriculum-api-2023/__mocks__/index";
import subjectPagePropsFixture from "@/node-lib/curriculum-api-2023/fixtures/subjectListing.fixture";

jest.mock("next/dist/client/router", () => require("next-router-mock"));
const props = subjectPagePropsFixture();

describe("pages/key-stages/[keyStageSlug]/subjects", () => {
  it("Renders title from props ", async () => {
    renderWithProviders()(<SubjectListingPage {...props} />);

    await waitFor(() => {
      expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
        "Key stage 4",
      );
    });
  });
  it("Renders eyfs keystage", async () => {
    renderWithProviders()(
      <SubjectListingPage
        {...props}
        keyStageSlug="early-years-foundation-stage"
        keyStageTitle="Early years foundation stage"
      />,
    );
    await waitFor(() => {
      expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
        "EYFS areas of learning",
      );
    });
  });
  it("Renders maths with correct counts in EYFS", () => {
    renderWithProviders()(
      <SubjectListingPage
        {...props}
        keyStageSlug="early-years-foundation-stage"
        keyStageTitle="Early years foundation stage"
        subjects={[
          {
            slug: "maths",
            data: {
              subjectSlug: "maths",
              subjectTitle: "Maths",
              unitCount: 1,
              lessonCount: 6,
              programmeSlug: "maths-early-years-foundation-stage",
              programmeCount: 2,
            },
            hasNewContent: true,
          },
        ]}
      />,
    );
    expect(screen.getByText("Maths")).toBeInTheDocument();
  });
  it("renders correct counts for non EYFS subjects", () => {
    renderWithProviders()(<SubjectListingPage {...props} />);

    expect(screen.getByText("Biology")).toBeInTheDocument();
    expect(
      screen.getByRole("link", {
        name: "Biology: 6 units, 35 lessons - new content",
      }),
    ).toBeInTheDocument();
  });

  describe("SEO", () => {
    it("renders the correct SEO details ", async () => {
      const { seo } = renderWithSeo()(<SubjectListingPage {...props} />);
      expect(seo).toEqual({
        ...mockSeoResult,
        ogSiteName: "NEXT_PUBLIC_SEO_APP_NAME",
        title:
          "Free KS4 Teaching Resources for Lesson Planning | NEXT_PUBLIC_SEO_APP_NAME",
        description:
          "Search by subject for free KS4 teaching resources to download and share",
        ogTitle:
          "Free KS4 Teaching Resources for Lesson Planning | NEXT_PUBLIC_SEO_APP_NAME",
        ogDescription:
          "Search by subject for free KS4 teaching resources to download and share",
        ogUrl: "NEXT_PUBLIC_SEO_APP_URL/",
        canonical: "NEXT_PUBLIC_SEO_APP_URL",
        robots: "index,follow",
      });
    });
  });

  describe("getStaticPaths", () => {
    it("Should not generate pages at build time", async () => {
      const res = await getStaticPaths();
      expect(res).toEqual({
        fallback: "blocking",
        paths: [],
      });
    });
  });

  describe("getStaticProps", () => {
    it("Should call API::subjectListing once", async () => {
      await getStaticProps({
        params: {
          keyStageSlug: "ks123",
        },
      });
      expect(curriculumApi.subjectListingPage).toHaveBeenCalledTimes(1);

      expect(curriculumApi.subjectListingPage).toHaveBeenNthCalledWith(1, {
        keyStageSlug: "ks123",
      });
    });
    it("should return notFound when a landing page is missing", async () => {
      (curriculumApi.subjectListingPage as jest.Mock).mockResolvedValueOnce(
        undefined,
      );

      const context = { params: { keyStageSlug: "test-key-stage" } };
      const response = await getStaticProps(context);
      expect(response).toEqual({
        notFound: true,
      });
    });
    it("should throw error when not provided context params", async () => {
      await expect(getStaticProps({})).rejects.toThrowError("No keyStageSlug");
    });
    it("should combine maths subjects into a single card", async () => {
      (curriculumApi.subjectListingPage as jest.Mock).mockResolvedValueOnce({
        keyStageSlug: "ks3",
        keyStageTitle: "Key Stage 3",
        subjects: [
          {
            subjectSlug: "maths",
            subjectTitle: "Maths",
            unitCount: 28,
            lessonCount: 390,
            programmeSlug: "maths-secondary-ks3",
            programmeCount: 1,
          },
        ],
        keyStages: [
          {
            slug: "ks3",
            title: "Key Stage 3",
            shortCode: "KS3",
            displayOrder: 4,
          },
        ],
      });
      (curriculumApi.subjectListingPage as jest.Mock).mockResolvedValueOnce({
        keyStageSlug: "ks3",
        keyStageTitle: "Key Stage 3",
        subjects: [
          {
            subjectSlug: "maths",
            subjectTitle: "Maths",
            unitCount: 53,
            lessonCount: 432,
            programmeSlug: "maths-secondary-ks3-l",
            programmeCount: 1,
          },
        ],
        keyStages: [],
      });
      const res = (await getStaticProps({
        params: {
          keyStageSlug: "ks3",
        },
      })) as { props: SubjectListingPageProps };

      const maths = res?.props.subjects.find((s) => s.slug === "maths");
      expect(maths?.hasNewContent).toBe(true);
      expect(maths?.data.subjectSlug).toBe("maths");
    });
    it("should not combine counts for EYFS maths", async () => {
      const mockEyfsMathsResponse = {
        keyStageSlug: "early-years-foundation-stage",
        keyStageTitle: "Early years foundation stage",
        subjects: [
          {
            subjectSlug: "maths",
            subjectTitle: "Maths",
            unitCount: 1,
            lessonCount: 6,
            programmeSlug: "maths-early-years-foundation-stage-l",
            programmeCount: 1,
          },
        ],
        keyStages: [],
      };
      (curriculumApi.subjectListingPage as jest.Mock).mockResolvedValueOnce(
        mockEyfsMathsResponse,
      );
      (curriculumApi.subjectListingPage as jest.Mock).mockResolvedValueOnce(
        mockEyfsMathsResponse,
      );
      const res = (await getStaticProps({
        params: {
          keyStageSlug: "early-years-foundation-stage",
        },
      })) as { props: SubjectListingPageProps };

      const maths = res?.props.subjects.find((s) => s.slug === "maths");
      expect(maths?.data).not.toBeNull();
      expect(maths?.hasNewContent).toBe(false);
    });
  });
});
