import { GetServerSideProps, NextPage } from "next";

import Layout from "@/components/AppComponents/Layout";
import { AboutUsLayout } from "@/components/GenericPagesComponents/AboutUsLayout";
import { getSeoProps } from "@/browser-lib/seo/getSeoProps";
import {
  AboutSharedHeader,
  BackgroundHeaderLoop,
} from "@/components/GenericPagesComponents/AboutSharedHeader";
import { GetInvolvedCollaborateWithUs } from "@/components/GenericPagesComponents/GetInvolvedCollaborateWithUs";
import { GetInvolvedWorkWithUs } from "@/components/GenericPagesComponents/GetInvolvedWorkWithUs";
import { getFeatureFlag } from "@/node-lib/posthog/getFeatureFlag";
import { getPosthogIdFromCookie } from "@/node-lib/posthog/getPosthogId";
import getBrowserConfig from "@/browser-lib/getBrowserConfig";
import { ImageWithAltText } from "@/node-lib/sanity-graphql/generated/sdk";
import { TopNavProps } from "@/components/AppComponents/TopNav/TopNav";
import curriculumApi2023 from "@/node-lib/curriculum-api-2023";

const posthogApiKey = getBrowserConfig("posthogApiKey");

export type GetInvolvedPage = {
  pageData: {
    header: {
      title: string;
      text: string;
    };
    collab: {
      title: string;
      image: ImageWithAltText;
      items: {
        title: string;
        content: string;
        buttonText: string;
        buttonLink: string;
      }[];
    };
    workWithUs: {
      title: string;
      text: string;
      image: ImageWithAltText;
      partnerImages: {
        image: ImageWithAltText;
      }[];
    };
  };
  topNav: TopNavProps;
};

const fixtureData: GetInvolvedPage["pageData"] = {
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

export const GetInvolved: NextPage<GetInvolvedPage> = ({
  pageData,
  topNav,
}) => {
  return (
    <Layout
      seoProps={getSeoProps(null)}
      $background={"bg-primary"}
      topNavProps={topNav}
    >
      <AboutUsLayout>
        <AboutSharedHeader
          title={pageData.header.title}
          content={pageData.header.text}
          titleHighlight="bg-decorative3-main"
        >
          <BackgroundHeaderLoop />
        </AboutSharedHeader>
        <GetInvolvedCollaborateWithUs
          heading="Collaborate with us"
          imageUrl="https://res.cloudinary.com/oak-web-application/image/upload/v1763393163/icons/chatting-illustration_l52zaf.svg"
          imageAlt=""
          cards={[
            {
              headingTag: "h3",
              headingTitle: "Join our teacher research panel",
              content:
                "Shape the future of Oak by taking part in interviews or surveys, and receive retail vouchers as a thank you for your contributions.",
              buttons: [
                {
                  text: "Join the research panel",
                  link: "https://share.hsforms.com/1dv2FiLvTQraZIZmhUUURmQbvumd",
                  external: true,
                },
                {
                  text: "Explore our research",
                  link: "/blog/categories/research-and-insights",
                },
              ],
            },
            {
              headingTag: "h3",
              headingTitle: "Give your feedback",
              content:
                "Share your story and we'll send you a gift voucher as a thanks for your time. Whether you've planned more efficiently, strengthened your subject knowledge or refreshed your curriculum design, your experience can inspire other teachers.",
              buttons: [
                {
                  text: "Get in touch",
                  link: "https://share.hsforms.com/2pi1ZLqVKQNyKznqJrpqsgwbvumd",
                  external: true,
                },
              ],
            },
          ]}
        />
        <GetInvolvedWorkWithUs
          heading="Work with us"
          text={[
            "We're a fast-paced and innovative team, working to support and inspire teachers to deliver great teaching, so every pupil benefits.",
            "All our roles are remote-first. If you want to be part of something unique that's making a difference to millions of children's lives, we'd love to hear from you.",
          ]}
          permanentRolesLink="https://app.beapplied.com/org/1574/oak-national-academy/"
          freelanceRolesLink="https://app.beapplied.com/org/1767/oak-national-academy-freelancers/"
          imageUrl="https://res.cloudinary.com/oak-web-application/image/upload/v1764066578/about-us/team-huddle_zivgxj.png"
          imageAlt=""
          badges={[
            {
              url: "https://res.cloudinary.com/oak-web-application/image/upload/v1764066553/about-us/top-1-percent-logo_hyga8g.svg",
              alt: "'In Escape the City's top 1% of employers'",
            },
            {
              url: "https://res.cloudinary.com/oak-web-application/image/upload/v1764066553/about-us/investor-in-people_eymeqv.svg",
              alt: "Awarded Gold in Investors In People",
            },
            {
              url: "https://res.cloudinary.com/oak-web-application/image/upload/v1764066553/about-us/disability-confident_ym07wl.png",
              alt: "Certified as Disability Confident Committed",
            },
          ]}
        />
      </AboutUsLayout>
    </Layout>
  );
};

export const getServerSideProps = (async (context) => {
  const posthogUserId = getPosthogIdFromCookie(
    context.req.cookies,
    posthogApiKey,
  );

  let enableV2: boolean = false;
  if (posthogUserId) {
    // get the variant key for the user
    enableV2 =
      (await getFeatureFlag({
        featureFlagKey: "about-us--who-we-are--v2",
        posthogUserId,
      })) === true;
  }
  const topNav = await curriculumApi2023.topNav();

  if (!enableV2) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      pageData: fixtureData,
      topNav,
    },
  };
}) satisfies GetServerSideProps<GetInvolvedPage>;

export default GetInvolved;
