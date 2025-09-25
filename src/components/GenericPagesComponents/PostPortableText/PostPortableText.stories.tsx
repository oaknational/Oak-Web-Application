import { StoryFn, Meta } from "@storybook/nextjs";

import AnalyticsDecorator from "../../../storybook-decorators/AnalyticsDecorator";

import Component from "./PostPortableText";

const sectionHeading = {
  _key: "924c8bdcbaf7",
  _type: "block",
  children: [
    {
      _key: "4a54e75774040",
      _type: "span",
      marks: [],
      text: "To plan for those unplanned days",
    },
  ],
  markDefs: [],
  style: "sectionHeading",
};

const video = {
  _key: "f4e28d54ec0e",
  _ref: "11b93e08-25a4-45fc-9e3f-4da8bb45e203",
  _type: "video",
  contentType: "video",
  title: "Oak is evolving",
  video: {
    asset: {
      assetId: "yHfnlREULGomTLTAcdt3iybOa8kDC005UOXYrLE1qvaU",
      playbackId: "4zX2n02AxYTM4bhm4SvJnA5leiiZVgMMnHM8w4hesP4c",
      thumbTime: 2,
    },
  },
  id: "11b93e08-25a4-45fc-9e3f-4da8bb45e203",
};

const quote = {
  _key: "b9955be0a1c7",
  _type: "quote",
  attribution: "Professor Dylan Wiliam",
  role: "Emeritus Professor of Educational Assessment, UCL",
  text: "The best curricula generate at least 25% more learning than the worst, irrespective of teacher quality.",
};

const textAndMedia = {
  _key: "9c579cd361f2",
  _type: "textAndMedia",
  alignMedia: "left",
  mediaType: "image",
  title: "text and media",
  body: [
    {
      _type: "block",
      _key: "af3f0b635ef1",
      style: "normal",
      markDefs: [],
      children: [
        {
          _type: "span",
          _key: "f44d2133da69",
          text: "Text and media body text",
          marks: [],
        },
      ],
    },
  ],
  cta: {
    _type: "cta",
    label: "CTA",
    linkType: "anchor",
    anchor: "formBlock",
  },
  image: {
    _type: "imageWithAltText",
    asset: {
      _type: "reference",
      _ref: "image-e773e8cf5a40205daacef9f97a9a6d45101eb0ae-720x480-png",
    },
    altText: "text",
  },
};

const callout = {
  _key: "1de5bdd05892",
  _type: "callout",
  body: [
    {
      _type: "block",
      _key: "889bbab67157",
      style: "normal",
      markDefs: [],
      children: [
        {
          _type: "span",
          _key: "9dd2c19278b1",
          text: "I'm a callout out!",
          marks: [],
        },
      ],
    },
  ],
};

export default {
  decorators: [AnalyticsDecorator],
  component: Component,
} as Meta<typeof Component>;

const Template: StoryFn<typeof Component> = (args) => {
  return <Component {...args} />;
};

export const PostSectionHeading = {
  render: Template,

  args: {
    portableText: [sectionHeading],
  },
};

export const PostVideo = {
  render: Template,

  args: {
    portableText: [video],
  },
};

export const PostQuote = {
  render: Template,

  args: {
    portableText: [quote],
  },
};

export const PostTextAndMedia = {
  render: Template,

  args: {
    portableText: [textAndMedia],
  },
};

export const PostCallout = {
  render: Template,

  args: {
    portableText: [callout],
  },
};
