import { forwardRef } from "react";
import { GetStaticPropsContext } from "next";
import "jest-styled-components";

import renderWithProviders from "../../__helpers__/renderWithProviders";
import AboutWhoWeAre, {
  getStaticProps,
} from "../../../pages/about-us/who-we-are";
import CMSClient from "../../../node-lib/cms";
import { WhoWeArePage } from "../../../common-lib/cms-types";

import { topNavFixture } from "@/node-lib/curriculum-api-2023/fixtures/topNav.fixture";
import {
  portableTextFromString,
  mockImageAsset,
} from "@/__tests__/__helpers__/cms";

jest.mock("../../../node-lib/cms");
jest.mock("@mux/mux-player-react/lazy", () => {
  return forwardRef((props, ref) => {
    ref; // This prevents warning about ref not being used
    return <div data-testid="mux-player-mock" />;
  });
});

const mockCMSClient = CMSClient as jest.MockedObject<typeof CMSClient>;

const mockPageData: WhoWeArePage = {
  header2: {
    introText: "We create free resources for teachers.",
    image: mockImageAsset(),
  },
  breakout2: {
    image: mockImageAsset(),
    text: "Oak National Academy was created in response to the pandemic.",
  },
  timeline2: {
    timelineItems: [
      {
        heading: "2020",
        subHeading: "Oak is born",
        textRaw: portableTextFromString("Oak launched during lockdown."),
      },
    ],
  },
  weAreCards: {
    cards: [
      {
        heading: "Free",
        image: mockImageAsset(),
        textRaw: portableTextFromString("All our resources are free."),
      },
    ],
  },
};

jest.mock("@/node-lib/curriculum-api-2023", () => ({
  __esModule: true,
  default: {
    topNav: () => jest.fn().mockResolvedValue(topNavFixture)(),
  },
}));

describe("pages/about/who-we-are.tsx", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetModules();
    mockCMSClient.whoWeArePage.mockResolvedValue(mockPageData);
  });

  it("renders", () => {
    const { container } = renderWithProviders()(
      <AboutWhoWeAre pageData={mockPageData} topNav={topNavFixture} />,
    );

    expect(container).toMatchSnapshot();
  });

  describe("getStaticProps", () => {
    it("should return notFound when CMS returns null", async () => {
      mockCMSClient.whoWeArePage.mockResolvedValueOnce(null);

      const propsResult = await getStaticProps({
        params: {},
      } as unknown as GetStaticPropsContext);

      expect(propsResult).toMatchObject({
        notFound: true,
      });
    });

    it("should return props when CMS returns data", async () => {
      const propsResult = await getStaticProps({
        params: {},
      } as unknown as GetStaticPropsContext);

      expect(propsResult).toMatchObject({
        props: {
          pageData: mockPageData,
        },
      });
    });
  });
});
