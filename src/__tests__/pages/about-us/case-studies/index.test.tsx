import { otherCaseStudies } from "@/__tests__/pages/about-us/case-studies/case-studies.fixtures";
import renderWithProviders from "@/__tests__/__helpers__/renderWithProviders";
import { topNavFixture } from "@/node-lib/curriculum-api-2023/fixtures/topNav.fixture";
import CaseStudyLibraryPage, {
  AboutUsCaseStudyLibraryPageProps,
  getStaticProps,
} from "@/pages/about-us/case-studies/index";
import CMSClient from "@/node-lib/cms";

jest.mock("@/node-lib/cms");
const mockCMSClient = CMSClient as jest.MockedObject<typeof CMSClient>;

const mockPageData: AboutUsCaseStudyLibraryPageProps["pageData"] = {
  caseStudies: otherCaseStudies,
};

describe("pages/about-us/case-studies/index.tsx", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetModules();
    mockCMSClient.caseStudyLibraryPage.mockResolvedValue(
      mockPageData.caseStudies,
    );
  });

  it("renders content", async () => {
    const { container } = renderWithProviders()(
      <CaseStudyLibraryPage topNav={topNavFixture} pageData={mockPageData} />,
    );

    expect(container).toHaveTextContent("TEST_TITLE_2");
    expect(container).toHaveTextContent("TEST_TITLE_3");
    expect(container).toHaveTextContent("TEST_TITLE_VIDEO");

    expect(container).toMatchSnapshot();
  });

  describe("getStaticProps", () => {
    it("should return props data", async () => {
      const propsResult = await getStaticProps({});

      expect(propsResult).toMatchObject({
        props: {
          topNav: topNavFixture,
          pageData: mockPageData,
        },
      });
    });

    it("should return notFound when CMS returns an empty array", async () => {
      mockCMSClient.caseStudyLibraryPage.mockResolvedValueOnce([]);

      const propsResult = await getStaticProps({});

      expect(propsResult).toMatchObject({
        notFound: true,
      });
    });
  });
});
