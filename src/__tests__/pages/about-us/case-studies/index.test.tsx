import { GetServerSidePropsContext } from "next/types";
import slugify from "slugify";

import renderWithProviders from "@/__tests__/__helpers__/renderWithProviders";
import { topNavFixture } from "@/node-lib/curriculum-api-2023/fixtures/topNav.fixture";
import OaksCaseStudyList, {
  AboutUsOaksImpactCaseStudyListPageProps,
  getServerSideProps,
} from "@/pages/about-us/case-studies/index";
import { isFeatureFlagEnabledServer } from "@/utils/featureFlagChecks/server";
import CMSClient from "@/node-lib/cms";

jest.mock("@/node-lib/cms");
const mockCMSClient = CMSClient as jest.MockedObject<typeof CMSClient>;

jest.mock("@/utils/featureFlagChecks/server", () => ({
  isFeatureFlagEnabledServer: jest.fn(() => false),
}));

function fixtureCaseStudy(title: string) {
  const slug = slugify(title);
  return {
    video: {
      title: title,
      video: {
        asset: {
          assetId: `asset-${slug}`,
          playbackId: `playback-${slug}`,
          thumbTime: null,
        },
      },
    },
    slug: {
      current: slug,
    },
    image: {
      asset: {
        _id: slug,
        url: `http://localhost/${slug}`,
      },
    },
    publishedAt: new Date(0).toISOString(),
  };
}

const mockPageData: AboutUsOaksImpactCaseStudyListPageProps["pageData"] = {
  caseStudies: [
    fixtureCaseStudy(`Test 1`),
    fixtureCaseStudy(`Test 2`),
    fixtureCaseStudy(`Test 3`),
  ],
};

describe("pages/about-us/case-studies/index.tsx", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetModules();
    mockCMSClient.oaksImpactCaseStudyListPage.mockResolvedValue(
      mockPageData.caseStudies,
    );
  });

  it("renders content", async () => {
    const { container } = renderWithProviders()(
      <OaksCaseStudyList topNav={topNavFixture} pageData={mockPageData} />,
    );

    expect(container).toHaveTextContent("Test 1");
    expect(container).toHaveTextContent("Test 2");
    expect(container).toHaveTextContent("Test 3");

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
