import { within } from "@testing-library/react";

import {
  caseStudy,
  caseStudyFixture,
  otherCaseStudies,
  videoCaseStudy,
} from "@/__tests__/pages/about-us/case-studies/case-studies.fixtures";
import renderWithProviders from "@/__tests__/__helpers__/renderWithProviders";
import { topNavFixture } from "@/node-lib/curriculum-api-2023/fixtures/topNav.fixture";
import CMSClient from "@/node-lib/cms";
import AboutUsCaseStudy, {
  getStaticProps,
  getStaticPaths,
} from "@/pages/about-us/case-studies/[slug]";
import * as isr from "@/node-lib/isr";

jest.mock("@/node-lib/curriculum-api-2023", () => ({
  __esModule: true,
  default: {
    topNav: () => jest.fn().mockResolvedValue(topNavFixture)(),
  },
}));

jest.mock("@/node-lib/isr", () => ({
  ...jest.requireActual("@/node-lib/isr"),
  shouldSkipInitialBuild: false,
  getFallbackBlockingConfig: jest.fn(() => ({
    fallback: "blocking",
    paths: [],
  })),
}));

jest.mock("@/node-lib/cms");

const mockCMSClient = CMSClient as jest.MockedObject<typeof CMSClient>;

beforeEach(() => {
  jest.clearAllMocks();
  jest.requireMock("@/node-lib/isr").shouldSkipInitialBuild = false;
  mockCMSClient.caseStudyPage.mockResolvedValue(caseStudy);
  mockCMSClient.caseStudyLibraryPage.mockResolvedValue(otherCaseStudies);
});

describe("pages/about-us/case-studies/[slug].tsx", () => {
  it("renders a case study with written content and embedded media correctly", async () => {
    const { container, getByRole } = renderWithProviders()(
      <AboutUsCaseStudy
        pageData={{ caseStudy, otherCaseStudies: [] }}
        topNav={topNavFixture}
      />,
    );

    expect(container).toMatchSnapshot();
    expect(container).toHaveTextContent("TEST_TITLE_1");
    expect(container).toHaveTextContent("TEST_TEXT_RAW");
    expect(container).toHaveTextContent("TEST_SUMMARY_1");
    expect(container).toHaveTextContent("TEST_PERSON_NAME");
    expect(container).toHaveTextContent("TEST_JOB_ROLE");
    expect(container).toHaveTextContent("TEST_INSTITUTION_NAME");

    expect(container).toHaveTextContent("TEST_HEADING_1");
    expect(container).toHaveTextContent("TEST_CONTENT_1");
    expect(container).toHaveTextContent("TEST_HEADING_2");
    expect(container).toHaveTextContent("Text alongside media");
    expect(
      getByRole("img", { name: "A classroom using Oak" }),
    ).toBeInTheDocument();
    expect(container).toHaveTextContent("Embedded video transcript");
  });

  it("renders a case study with video only correctly", async () => {
    const { container } = renderWithProviders()(
      <AboutUsCaseStudy
        pageData={{ caseStudy: videoCaseStudy, otherCaseStudies: [] }}
        topNav={topNavFixture}
      />,
    );

    expect(container).toMatchSnapshot();
    expect(container).toHaveTextContent("TEST_TITLE_VIDEO");
  });

  it("renders breadcrumbs correctly", async () => {
    const { getAllByRole } = renderWithProviders()(
      <AboutUsCaseStudy
        pageData={{ caseStudy, otherCaseStudies: [] }}
        topNav={topNavFixture}
      />,
    );

    expect(getAllByRole("navigation")[1]).toHaveTextContent("Case studies");
  });

  it("renders the other case studies", async () => {
    const { container, getAllByRole, queryByRole } = renderWithProviders()(
      <AboutUsCaseStudy
        pageData={{ caseStudy, otherCaseStudies }}
        topNav={topNavFixture}
      />,
    );

    const otherCaseStudiesLinks = getAllByRole("link", {
      name: /TEST_TITLE_/,
    }).map((link) => link.getAttribute("href"));

    expect(container).toMatchSnapshot();
    expect(otherCaseStudiesLinks).toEqual([
      "/about-us/case-studies/test-2",
      "/about-us/case-studies/test-3",
      "/about-us/case-studies/test-video",
    ]);
    expect(otherCaseStudiesLinks).toHaveLength(3);
    expect(
      queryByRole("link", { name: "View all case studies" }),
    ).toBeInTheDocument();
  });

  it("renders a sidebar nav with label names when there are at least two content sections", () => {
    const { getByLabelText } = renderWithProviders()(
      <AboutUsCaseStudy
        pageData={{ caseStudy, otherCaseStudies: [] }}
        topNav={topNavFixture}
      />,
    );

    const nav = getByLabelText("Contents");
    const navLinks = within(nav).getAllByRole("link");

    expect(nav).toBeVisible();
    expect(navLinks).toHaveLength(2);
    expect(navLinks[0]).toHaveTextContent("TEST_LABEL_1");
    expect(navLinks[0]).toHaveAttribute(
      "href",
      `#${caseStudy.content[0]?.anchorSlug.current}`,
    );
  });

  it("does not render a sidebar nav when there are less than two content sections", () => {
    const caseStudyWithOneContentSection = {
      ...caseStudy,
      content: caseStudy.content.slice(0, 1),
    };

    const { queryByLabelText } = renderWithProviders()(
      <AboutUsCaseStudy
        pageData={{
          caseStudy: caseStudyWithOneContentSection,
          otherCaseStudies: [],
        }}
        topNav={topNavFixture}
      />,
    );
    expect(queryByLabelText("Contents")).toBeNull();
  });

  describe("getStaticProps", () => {
    it("returns props data", async () => {
      const propsResult = await getStaticProps({
        params: { slug: "test-slug-1" },
        revalidateReason: "build",
      });

      expect(propsResult).toMatchObject({
        props: {
          pageData: { caseStudy, otherCaseStudies },
          topNav: topNavFixture,
        },
      });
    });

    it("passes preview mode to both CMS queries", async () => {
      await getStaticProps({
        params: { slug: "test-slug-1" },
        preview: true,
        revalidateReason: "build",
      });

      expect(mockCMSClient.caseStudyPage).toHaveBeenCalledWith({
        slug: "test-slug-1",
        previewMode: true,
      });
      expect(mockCMSClient.caseStudyLibraryPage).toHaveBeenCalledWith({
        slug: "test-slug-1",
        previewMode: true,
      });
    });

    it("returns notFound when the slug is missing", async () => {
      const propsResult = await getStaticProps({ revalidateReason: "build" });

      expect(propsResult).toMatchObject({
        notFound: true,
      });
    });

    it("returns notFound when CMS returns null", async () => {
      mockCMSClient.caseStudyPage.mockResolvedValueOnce(null);

      const propsResult = await getStaticProps({
        params: { slug: "test-slug-1" },
        revalidateReason: "build",
      });

      expect(propsResult).toMatchObject({
        notFound: true,
      });
    });
  });

  describe("getStaticPaths", () => {
    it("returns the paths of all case studies", async () => {
      mockCMSClient.caseStudyLibraryPage.mockResolvedValueOnce([
        caseStudyFixture(1),
        caseStudyFixture(2),
        caseStudyFixture(3),
      ]);
      const pathsResult = await getStaticPaths();

      expect(pathsResult).toEqual({
        fallback: "blocking",
        paths: [
          { params: { slug: "test-1" } },
          { params: { slug: "test-2" } },
          { params: { slug: "test-3" } },
        ],
      });
    });

    it("returns no paths when the library is empty", async () => {
      mockCMSClient.caseStudyLibraryPage.mockResolvedValueOnce([]);

      expect(await getStaticPaths()).toEqual({
        fallback: "blocking",
        paths: [],
      });
    });

    it("returns the fallback blocking config when initial build is skipped", async () => {
      jest.requireMock("@/node-lib/isr").shouldSkipInitialBuild = true;

      const pathsResult = await getStaticPaths();

      expect(isr.getFallbackBlockingConfig).toHaveBeenCalled();
      expect(mockCMSClient.caseStudyLibraryPage).not.toHaveBeenCalled();
      expect(pathsResult).toEqual({
        fallback: "blocking",
        paths: [],
      });
    });
  });
});
