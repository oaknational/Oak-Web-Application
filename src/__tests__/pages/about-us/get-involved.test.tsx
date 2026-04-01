import { forwardRef } from "react";
import { GetStaticPropsContext } from "next";
import "jest-styled-components";

import renderWithProviders from "../../__helpers__/renderWithProviders";

import { testAboutPageBaseData } from "./about-us.fixtures";

import GetInvolved, {
  GetInvolvedPageProps,
  getStaticProps,
} from "@/pages/about-us/get-involved";
import { portableTextFromString, mockImageAsset } from "@/__tests__/__helpers__/cms";
import CMSClient from "@/node-lib/cms";
import { topNavFixture } from "@/node-lib/curriculum-api-2023/fixtures/topNav.fixture";
jest.mock("../../../node-lib/cms");
jest.mock("@mux/mux-player-react/lazy", () => {
  return forwardRef((props, ref) => {
    ref; // This prevents warning about ref not being used
    return <div data-testid="mux-player-mock" />;
  });
});

const testAboutWhoWeArePageData: GetInvolvedPageProps["pageData"] = {
  ...testAboutPageBaseData,
  header: {
    introText: "We need your help to understand what's needed in the classroom. Want to get involved? We can't wait to hear from you.",
  },
  collaborate: {
    researchPanelTextRaw: portableTextFromString(
      "Share your story and we'll send you a gift voucher as a thanks for your time. Whether you've planned more efficiently, strengthened your subject knowledge or refreshed your curriculum design, your experience can inspire other teachers.",
    ),
    feedbackTextRaw: portableTextFromString(
      "Teachers are at the heart of everything we build. Have your say by taking part in research or road-testing new resources in your school. ",
    ),
  },
  workWithUs: {
    textRaw: portableTextFromString(
      `We're a fast-paced and innovative team, working to support and inspire teachers to deliver great teaching, so every pupil benefits. All our roles are remote-first. If you want to be part of something unique that's making a difference to millions of children's lives, we'd love to hear from you.`,
    ),
    image: mockImageAsset(),
  },
};

describe("pages/about/get-involved.tsx", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetModules();
    (CMSClient.newAboutGetInvolvedPage as jest.Mock).mockResolvedValue(
      testAboutWhoWeArePageData,
    );
  });

  it("renders", () => {
    const { container } = renderWithProviders()(
      <GetInvolved
        pageData={testAboutWhoWeArePageData}
        topNav={topNavFixture}
      />,
    );

    expect(container).toMatchSnapshot();
  });

  describe("getStaticProps", () => {
    it("should 404 when no data returned from CMS", async () => {
      (CMSClient.newAboutGetInvolvedPage as jest.Mock).mockResolvedValue(null);

      const propsResult = await getStaticProps({
        params: {},
      } as unknown as GetStaticPropsContext);

      expect(propsResult).toMatchObject({
        notFound: true,
      });
    });
  });
});
