import { GetServerSidePropsContext } from "next/types";

import { otherCaseStudies } from "@/__tests__/pages/about-us/case-studies/case-studies.fixtures";
import renderWithProviders from "@/__tests__/__helpers__/renderWithProviders";
import { topNavFixture } from "@/node-lib/curriculum-api-2023/fixtures/topNav.fixture";
import CaseStudyLibraryPage, {
  AboutUsCaseStudyLibraryPageProps,
  getServerSideProps,
} from "@/pages/about-us/case-studies/index";
import { isFeatureFlagEnabledServer } from "@/utils/featureFlagChecks/server";
import CMSClient from "@/node-lib/cms";

jest.mock("@/node-lib/cms");
const mockCMSClient = CMSClient as jest.MockedObject<typeof CMSClient>;

jest.mock("@/utils/featureFlagChecks/server", () => ({
  isFeatureFlagEnabledServer: jest.fn(() => false),
}));

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

  describe("getServerSideProps", () => {
    it("returns data when enabled", async () => {
      (isFeatureFlagEnabledServer as jest.Mock).mockImplementation(
        (_cookies, flag) => {
          return flag === "case-studies-v2" ? true : false;
        },
      );

      const propsResult = await getServerSideProps({
        req: {
          cookies: {},
        },
      } as GetServerSidePropsContext);

      expect(propsResult).toMatchObject({
        props: {
          topNav: topNavFixture,
          pageData: mockPageData,
        },
      });
    });

    it("returns not-found when not enabled", async () => {
      (isFeatureFlagEnabledServer as jest.Mock).mockImplementation(() => false);

      const propsResult = await getServerSideProps({
        req: {
          cookies: {},
        },
      } as GetServerSidePropsContext);

      expect(propsResult).toMatchObject({
        notFound: true,
      });
    });
  });
});
