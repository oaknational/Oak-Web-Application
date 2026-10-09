import { portableTextFromString } from "@/__tests__/__helpers__/cms";
import { JoinResearchPanelPageBlock } from "@/common-lib/cms-types";

const headerBlockFixture: JoinResearchPanelPageBlock<"JoinResearchPanelPageHeader"> =
  {
    __typename: "JoinResearchPanelPageHeader",
    title: "Join the research panel header",
    bodyRaw: portableTextFromString("Join the research panel header"),
    image: {
      asset: {
        _id: "image-d16d5ceea1923b8cf31845affe93f9626f600c4c-240x320-png",
        url: "https://cdn.sanity.io/images/cuvjke51/production/d16d5ceea1923b8cf31845affe93f9626f600c4c-240x320.png",
      },
    },
    button: {
      label: "Join the research panel",
      linkType: "external",
      external: "https://www.example.com",
    },
  };

export const calloutBlockFixture: JoinResearchPanelPageBlock<"JoinResearchPanelPageCallout"> =
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

const infoBlockFixture = (
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

const journeyBlockFixture: JoinResearchPanelPageBlock<"JoinResearchPanelPageJourney"> =
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

const peopleBlockFixture: JoinResearchPanelPageBlock<"JoinResearchPanelPagePeople"> =
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

const faqsBlockFixture: JoinResearchPanelPageBlock<"JoinResearchPanelPageFaqs"> =
  {
    __typename: "JoinResearchPanelPageFaqs",
    items: [
      {
        question: "Question 1",
        answerRaw: portableTextFromString("Answer 1"),
      },
    ],
  };

const contactUsBlockFixture: JoinResearchPanelPageBlock<"JoinResearchPanelPageContactUs"> =
  {
    __typename: "JoinResearchPanelPageContactUs",
    title: "Join the research panel contact us",
    button: {
      label: "Join the research panel",
      linkType: "external",
      external: "https://www.example.com",
    },
  };

const joinResearchPanelPageFixture = {
  blocks: [
    headerBlockFixture,
    calloutBlockFixture,
    infoBlockFixture(),
    journeyBlockFixture,
    infoBlockFixture("Info 2"),
    peopleBlockFixture,
    faqsBlockFixture,
    contactUsBlockFixture,
  ],
};

export default joinResearchPanelPageFixture;
