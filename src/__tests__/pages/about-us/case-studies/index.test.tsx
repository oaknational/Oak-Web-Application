import renderWithProviders from "@/__tests__/__helpers__/renderWithProviders";
import { topNavFixture } from "@/node-lib/curriculum-api-2023/fixtures/topNav.fixture";
import OaksCaseStudyList, {
  getServerSideProps,
} from "@/pages/about-us/case-studies/index";

const mockShouldSkipInitialBuild = false;

jest.mock("@/node-lib/curriculum-api-2023", () => ({
  __esModule: true,
  default: {
    topNav: () => jest.fn().mockResolvedValue(topNavFixture)(),
  },
}));

jest.mock("@/node-lib/isr", () => ({
  ...jest.requireActual("@/node-lib/isr"),
  get shouldSkipInitialBuild() {
    return mockShouldSkipInitialBuild;
  },
  getFallbackBlockingConfig: jest.fn(),
}));

jest.mock("@/node-lib/cms");

describe("pages/about-us/case-studies/index.tsx", () => {
  it("renders title", async () => {
    const { container } = renderWithProviders()(
      <OaksCaseStudyList topNav={topNavFixture} />,
    );

    expect(container).toMatchSnapshot();
  });

  describe("getServerSideProps", () => {
    it("returns props data", async () => {
      const propsResult = await getServerSideProps({
        req: {
          cookies: {},
        },
      });

      expect(propsResult).toMatchObject({
        props: {
          topNav: topNavFixture,
        },
      });
    });
  });
});
