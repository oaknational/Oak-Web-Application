import { forwardRef } from "react";
import { GetServerSidePropsContext } from "next";
import "jest-styled-components";

import renderWithProviders from "../../__helpers__/renderWithProviders";
import AboutWhoWeAre, {
  getServerSideProps,
} from "../../../pages/about-us/who-we-are";
import CMSClient from "../../../node-lib/cms";
import { NewAboutWhoWeArePage } from "../../../common-lib/cms-types";

import { topNavFixture } from "@/node-lib/curriculum-api-2023/fixtures/topNav.fixture";

jest.mock("../../../node-lib/cms");
jest.mock("@mux/mux-player-react/lazy", () => {
  return forwardRef((props, ref) => {
    ref; // This prevents warning about ref not being used
    return <div data-testid="mux-player-mock" />;
  });
});

const mockCMSClient = CMSClient as jest.MockedObject<typeof CMSClient>;

const mockImage = {
  asset: {
    _id: "image-1-300x300-png",
    url: "https://cdn.sanity.io/images/p/d/1-300x300.png",
  },
  altText: "test image",
};

const mockPageData: NewAboutWhoWeArePage = {
  header: {
    title: "About Oak",
    subTitle: "We create free resources for teachers.",
  },
  breakout: {
    image: mockImage,
    text: "Oak National Academy was created in response to the pandemic.",
  },
  timeline: [
    {
      title: "2020",
      subTitle: "Oak is born",
      text: [
        {
          _key: "key0001",
          _type: "block",
          children: [
            {
              _key: "key0002",
              _type: "span",
              marks: [],
              text: "Oak launched during lockdown.",
            },
          ],
          markDefs: [],
          style: "normal",
        },
      ],
    },
  ],
  usp: [
    {
      title: "Free",
      image: mockImage,
      text: "All our resources are free.",
    },
  ],
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
    mockCMSClient.newAboutWhoWeArePage.mockResolvedValue(mockPageData);
  });

  it("renders", () => {
    const { container } = renderWithProviders()(
      <AboutWhoWeAre pageData={mockPageData} topNav={topNavFixture} />,
    );

    expect(container).toMatchSnapshot();
  });

  describe("getServerSideProps", () => {
    it("should return notFound when CMS returns null", async () => {
      mockCMSClient.newAboutWhoWeArePage.mockResolvedValueOnce(null);

      const propsResult = await getServerSideProps({
        req: { cookies: {} },
        res: {},
        query: {},
        params: {},
      } as unknown as GetServerSidePropsContext);

      expect(propsResult).toMatchObject({
        notFound: true,
      });
    });

    it("should return props when CMS returns data", async () => {
      const propsResult = await getServerSideProps({
        req: { cookies: {} },
        res: {},
        query: {},
        params: {},
      } as unknown as GetServerSidePropsContext);

      expect(propsResult).toMatchObject({
        props: {
          pageData: mockPageData,
        },
      });
    });
  });
});
