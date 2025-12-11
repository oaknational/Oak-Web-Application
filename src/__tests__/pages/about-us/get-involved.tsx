import { forwardRef } from "react";
import { GetServerSidePropsContext } from "next";

import renderWithProviders from "../../__helpers__/renderWithProviders";

import { testAboutPageBaseData } from "./about-us.fixtures";

import GetInvolved, {
  GetInvolvedPage,
  getServerSideProps,
} from "@/pages/about-us/get-involved";
import { getFeatureFlag } from "@/node-lib/posthog/getFeatureFlag";

jest.mock("@/node-lib/posthog/getFeatureFlag");
jest.mock("../../../node-lib/cms");
jest.mock("@mux/mux-player-react/lazy", () => {
  return forwardRef((props, ref) => {
    ref; // This prevents warning about ref not being used
    return <div data-testid="mux-player-mock" />;
  });
});

const testAboutWhoWeArePageData: GetInvolvedPage["pageData"] = {
  ...testAboutPageBaseData,
  header: {
    title: "Get involved",
    text: "We need your help to understand what's needed in the classroom. Want to get involved? We can't wait to hear from you.",
  },
  collab: {
    title: "Collaborate with us",
    image: {
      asset: {
        url: "https://res.cloudinary.com/oak-web-application/image/upload/v1734018530/OWA/illustrations/auth-acorn_zyoma2.svg",
      },
      altText: "",
    },
    items: [
      {
        title: "Give your feedback",
        content:
          "Share your story and we'll send you a gift voucher as a thanks for your time. Whether you've planned more efficiently, strengthened your subject knowledge or refreshed your curriculum design, your experience can inspire other teachers.",
        buttonText: "Get in touch",
        buttonLink: "#",
      },
      {
        title: "Help us improve",
        content:
          "Teachers are at the heart of everything we build. Have your say by taking part in research or road-testing new resources in your school. ",
        buttonText: "Take part in research",
        buttonLink: "#",
      },
    ],
  },
  workWithUs: {
    title: "Work with us",
    text: `We're a fast-paced and innovative team, working to support and inspire teachers to deliver great teaching, so every pupil benefits. All our roles are remote-first. If you want to be part of something unique that's making a difference to millions of children's lives, we'd love to hear from you.`,
    image: {
      asset: {
        url: "https://res.cloudinary.com/oak-web-application/image/upload/v1734018530/OWA/illustrations/auth-acorn_zyoma2.svg",
      },
      altText: "",
    },
    partnerImages: [
      {
        image: {
          asset: {
            url: "https://res.cloudinary.com/oak-web-application/image/upload/v1734018530/OWA/illustrations/auth-acorn_zyoma2.svg",
          },
          altText: "",
        },
      },
      {
        image: {
          asset: {
            url: "https://res.cloudinary.com/oak-web-application/image/upload/v1734018530/OWA/illustrations/auth-acorn_zyoma2.svg",
          },
          altText: "",
        },
      },
      {
        image: {
          asset: {
            url: "https://res.cloudinary.com/oak-web-application/image/upload/v1734018530/OWA/illustrations/auth-acorn_zyoma2.svg",
          },
          altText: "",
        },
      },
    ],
  },
};

describe("pages/about/who-we-are.tsx", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetModules();
  });

  it("renders", () => {
    const { container } = renderWithProviders()(
      <GetInvolved pageData={testAboutWhoWeArePageData} />,
    );

    expect(container).toMatchSnapshot();
  });

  describe("getStaticProps", () => {
    it("should 404 when not enabled", async () => {
      (getFeatureFlag as jest.Mock).mockResolvedValue(false);
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
  });
});
