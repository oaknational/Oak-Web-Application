import { portableTextFromString } from "@/__tests__/__helpers__/cms";
import { JoinResearchPanelPageBlock } from "@/common-lib/cms-types";
import { mockBlogPreview } from "@/components/GenericPagesComponents/BlogsPreview/BlogsPreview.fixtures";

export const joinResearchPanelHeaderBlockFixture: JoinResearchPanelPageBlock<"JoinResearchPanelPageHeader"> =
  {
    __typename: "JoinResearchPanelPageHeader",
    title: "Join the Oak research panel",
    bodyRaw: portableTextFromString(
      "Your feedback is essential to help us understand the realities of teaching and learning. By listening to teachers like you, we learn about your preferences, challenges and needs, and can use these insights to shape Oak curriculum resources, lessons and tools.",
    ),
    image: {
      asset: {
        _id: "image-1b28197a71f5e06f82f71f328e0eb607aca8b275-632x422-png",
        url: "https://cdn.sanity.io/images/cuvjke51/production/1b28197a71f5e06f82f71f328e0eb607aca8b275-632x422.png",
      },
    },
    button: {
      label: "Join the research panel",
      linkType: "external",
      external: "https://example.com",
    },
  };

export const joinResearchPanelCalloutBlockFixture: JoinResearchPanelPageBlock<"JoinResearchPanelPageCallout"> =
  {
    __typename: "JoinResearchPanelPageCallout",
    title: "Join the research panel callout",
    items: [
      {
        icon: {
          asset: {
            _id: "image-0123c8cd16c86e1095af18a8f65d427d1c8dd2f9-80x80-svg",
            url: "https://cdn.sanity.io/images/cuvjke51/production/0123c8cd16c86e1095af18a8f65d427d1c8dd2f9-80x80.svg",
          },
        },
        bodyRaw: [
          {
            ...portableTextFromString("Join the research panel callout")[0],
            _key: "key0001",
          },
        ],
      },
      {
        icon: {
          asset: {
            _id: "image-b5ee98bf752dff246de88f50ad59e07131902189-80x80-svg",
            url: "https://cdn.sanity.io/images/cuvjke51/production/b5ee98bf752dff246de88f50ad59e07131902189-80x80.svg",
          },
        },
        bodyRaw: [
          {
            ...portableTextFromString("Join the research panel callout")[0],
            _key: "key0002",
          },
        ],
      },
      {
        icon: {
          asset: {
            _id: "image-8d46237f90341dc2f1ef9f99db370a97e3d014d9-72x54-svg",
            url: "https://cdn.sanity.io/images/cuvjke51/production/8d46237f90341dc2f1ef9f99db370a97e3d014d9-72x54.svg",
          },
        },
        bodyRaw: [
          {
            ...portableTextFromString("Join the research panel callout")[0],
            _key: "key0003",
          },
        ],
      },
    ],
  };

export const joinResearchPanelInfoBlockFixture = (
  title?: string,
  body?: string,
): JoinResearchPanelPageBlock<"JoinResearchPanelPageInfo"> => ({
  __typename: "JoinResearchPanelPageInfo",
  title: title ?? "Join the research panel",
  image: {
    asset: {
      _id: "image-7499298e050630504fc8eb15bb8de2c864942575-633x486-png",
      url: "https://cdn.sanity.io/images/cuvjke51/production/7499298e050630504fc8eb15bb8de2c864942575-633x486.png",
    },
  },
  bodyRaw: portableTextFromString(body ?? "Join the research panel"),
});

export const joinResearchPanelJourneyBlockFixture: JoinResearchPanelPageBlock<"JoinResearchPanelPageJourney"> =
  {
    __typename: "JoinResearchPanelPageJourney",
    title: "Join the research panel journey",
    steps: [
      {
        title: "Join the research panel",
        descriptionRaw: portableTextFromString(
          "Join the research panel journey",
        ),
      },
    ],
    button: {
      label: "Join the research panel",
      linkType: "external",
      external: "https://www.example.com",
    },
  };

export const joinResearchPanelPeopleBlockFixture: JoinResearchPanelPageBlock<"JoinResearchPanelPagePeople"> =
  {
    __typename: "JoinResearchPanelPagePeople",
    title: "Join the research panel people",
    members: [
      {
        name: "Person 1",
        image: {
          asset: {
            _id: "image-d16d5ceea1923b8cf31845affe93f9626f600c4c-240x320-png",
            url: "https://cdn.sanity.io/images/cuvjke51/production/d16d5ceea1923b8cf31845affe93f9626f600c4c-240x320.png",
          },
        },
        bodyRaw: portableTextFromString("Join the research panel people"),
      },
    ],
  };

export const joinResearchPanelBlogsPreviewBlockFixture: JoinResearchPanelPageBlock<"JoinResearchPanelPageBlogsPreview"> =
  {
    __typename: "JoinResearchPanelPageBlogsPreview",
    title: "Blogs",
    label: "View all blogs",
  };

export const joinResearchPanelFaqsBlockFixture: JoinResearchPanelPageBlock<"JoinResearchPanelPageFaqs"> =
  {
    __typename: "JoinResearchPanelPageFaqs",
    items: [
      {
        question: "Question 1",
        answerRaw: portableTextFromString("Answer 1"),
      },
    ],
  };

export const joinResearchPanelContactUsBlockFixture: JoinResearchPanelPageBlock<"JoinResearchPanelPageContactUs"> =
  {
    __typename: "JoinResearchPanelPageContactUs",
    title: "Join the research panel contact us",
    button: {
      label: "Join the research panel",
      linkType: "external",
      external: "https://www.example.com",
    },
  };

export const joinResearchPanelPageFixture = {
  content: {
    blocks: [
      joinResearchPanelHeaderBlockFixture,
      joinResearchPanelCalloutBlockFixture,
      joinResearchPanelInfoBlockFixture(),
      joinResearchPanelJourneyBlockFixture,
      joinResearchPanelInfoBlockFixture("Info 2"),
      joinResearchPanelPeopleBlockFixture,
      joinResearchPanelBlogsPreviewBlockFixture,
      joinResearchPanelFaqsBlockFixture,
      joinResearchPanelContactUsBlockFixture,
    ],
  },
  blogs: [mockBlogPreview("1"), mockBlogPreview("2"), mockBlogPreview("3")],
};

export default joinResearchPanelPageFixture;
