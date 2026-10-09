import { portableTextFromString } from "@/__tests__/__helpers__/cms";
import { JoinResearchPanelPageBlock } from "@/common-lib/cms-types";

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
            _id: "image-d16d5ceea1923b8cf31845affe93f9626f600c4c-240x320-png",
            url: "https://cdn.sanity.io/images/cuvjke51/production/d16d5ceea1923b8cf31845affe93f9626f600c4c-240x320.png",
          },
        },
        bodyRaw: portableTextFromString("Join the research panel callout"),
      },
    ],
  };

export const joinResearchPanelInfoBlockFixture = (
  title?: string,
): JoinResearchPanelPageBlock<"JoinResearchPanelPageInfo"> => ({
  __typename: "JoinResearchPanelPageInfo",
  title: title ?? "Join the research panel",
  image: {
    asset: {
      _id: "image-d16d5ceea1923b8cf31845affe93f9626f600c4c-240x320-png",
      url: "https://cdn.sanity.io/images/cuvjke51/production/d16d5ceea1923b8cf31845affe93f9626f600c4c-240x320.png",
    },
  },
  bodyRaw: portableTextFromString(title ?? "Join the research panel"),
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
  blocks: [
    joinResearchPanelHeaderBlockFixture,
    joinResearchPanelCalloutBlockFixture,
    joinResearchPanelInfoBlockFixture(),
    joinResearchPanelJourneyBlockFixture,
    joinResearchPanelInfoBlockFixture("Info 2"),
    joinResearchPanelPeopleBlockFixture,
    joinResearchPanelFaqsBlockFixture,
    joinResearchPanelContactUsBlockFixture,
  ],
};

export default joinResearchPanelPageFixture;
