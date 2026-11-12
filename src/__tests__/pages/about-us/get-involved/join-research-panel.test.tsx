import "jest-styled-components";

import joinResearchPanelPageFixture from "./join-research-panel.fixtures";

import "@/__tests__/__helpers__/ResizeObserverMock";
import renderWithProviders from "@/__tests__/__helpers__/renderWithProviders";
import AboutUsJoinResearchPanel, {
  getStaticProps,
} from "@/pages/about-us/get-involved/join-research-panel";
import { topNavFixture } from "@/node-lib/curriculum-api-2023/fixtures/topNav.fixture";
import CMSClient from "@/node-lib/cms";
import { serializeDate } from "@/utils/serializeDate";

jest.mock("@/node-lib/curriculum-api-2023", () => ({
  __esModule: true,
  default: {
    topNav: () => jest.fn().mockResolvedValue(topNavFixture)(),
  },
}));

jest.mock("@/node-lib/cms");

const mockCMSClient = CMSClient as jest.MockedObject<typeof CMSClient>;

beforeEach(() => {
  jest.clearAllMocks();
  mockCMSClient.joinResearchPanelPage.mockResolvedValue(
    joinResearchPanelPageFixture,
  );
});

describe("pages/about/get-involved/join-research-panel.tsx", () => {
  it("renders", () => {
    const { container } = renderWithProviders()(
      <AboutUsJoinResearchPanel
        topNav={topNavFixture}
        pageData={{
          ...joinResearchPanelPageFixture,
          blogs: joinResearchPanelPageFixture.blogs.map(serializeDate),
        }}
      />,
    );

    expect(container).toMatchSnapshot();
  });

  describe("getStaticProps", () => {
    it("should return serialized date data", async () => {
      const propsResult = await getStaticProps({});

      expect(propsResult).toMatchObject({
        props: {
          pageData: {
            ...joinResearchPanelPageFixture,
            blogs: joinResearchPanelPageFixture.blogs.map(serializeDate),
          },
        },
      });
    });
  });
});
