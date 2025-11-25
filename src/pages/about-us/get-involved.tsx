import { GetServerSideProps, NextPage } from "next";
import { OakBox } from "@oaknational/oak-components";

import Layout from "@/components/AppComponents/Layout";
import { getSeoProps } from "@/browser-lib/seo/getSeoProps";
import { WhoAreWeHeader } from "@/components/GenericPagesComponents/WhoAreWeHeader";
import { WhoAreWeExplore } from "@/components/GenericPagesComponents/WhoAreWeExplore";
import { GetInvolvedCollaborateWithUs } from "@/components/GenericPagesComponents/GetInvolvedCollaborateWithUs";
import { getFeatureFlag } from "@/node-lib/posthog/getFeatureFlag";
import { getPosthogIdFromCookie } from "@/node-lib/posthog/getPosthogId";
import getBrowserConfig from "@/browser-lib/getBrowserConfig";
import { ImageWithAltText } from "@/node-lib/sanity-graphql/generated/sdk";

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

function TodoSection({ name, text }: Readonly<{ name: string; text: string }>) {
  return (
    <OakBox>
      <h2>{name}</h2>
      <pre style={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
        <code>{text}</code>
      </pre>
    </OakBox>
  );
}

export const GetInvolved: NextPage<GetInvolvedPage> = ({ pageData }) => {
  return (
    <Layout seoProps={getSeoProps(null)} $background={"white"}>
      <WhoAreWeHeader
        title={pageData.header.title}
        content={pageData.header.text}
        imageUrl={
          "https://res.cloudinary.com/oak-web-application/image/upload/v1734018530/OWA/illustrations/auth-acorn_zyoma2.svg"
        }
        imageAlt={""}
      />
      <GetInvolvedCollaborateWithUs
        heading="Collaborate with us"
        imageUrl="https://res.cloudinary.com/oak-web-application/image/upload/v1763393163/icons/chatting-illustration_l52zaf.svg"
        imageAlt="Two people having a conversation"
        cards={[
          {
            headingTag: "h3",
            headingTitle: "Give your feedback",
            content:
              "Share your story and we'll send you a gift voucher as a thanks for your time. Whether you've planned more efficiently, strengthened your subject knowledge or refreshed your curriculum design, your experience can inspire other teachers.",
            buttonText: "Get in touch",
            buttonLink:
              "https://share.hsforms.com/2pi1ZLqVKQNyKznqJrpqsgwbvumd",
          },
          {
            headingTag: "h3",
            headingTitle: "Help us improve",
            content:
              "Teachers are at the heart of everything we build. Have your say by taking part in research or road-testing new resources in your school.",
            buttonText: "Take part in research",
            buttonLink:
              "https://share.hsforms.com/1dv2FiLvTQraZIZmhUUURmQbvumd",
          },
        ]}
      />
      <TodoSection
        name="workWithUs"
        text={JSON.stringify(pageData.workWithUs, null, 2)}
      />
      <WhoAreWeExplore
        title={"Explore more about Oak"}
        items={[
          {
            iconName: "logo",
            title: "About Oak",
            href: "#",
          },
          {
            iconName: "homepage-teacher-map",
            title: "About Oak’s curriculum",
            href: "#",
          },
          {
            iconName: "data",
            title: "Oaks impact",
            href: "#",
          },
          {
            iconName: "snack-break",
            title: "Meet the team",
            href: "#",
          },
        ]}
      />
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

  if (!enableV2) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      pageData: fixtureData,
    },
  };
}) satisfies GetServerSideProps<GetInvolvedPage>;

export default GetInvolved;
