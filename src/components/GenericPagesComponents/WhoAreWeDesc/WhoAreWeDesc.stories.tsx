import { Meta, StoryObj } from "@storybook/nextjs";
import { oakDefaultTheme, OakThemeProvider } from "@oaknational/oak-components";

import { WhoAreWeDesc as Component } from ".";

const meta: Meta<typeof Component> = {
  component: Component,
  tags: ["autodocs"],
  title: "Components/GenericPagesComponents/WhoAreWeDesc",
  argTypes: {},
  decorators: [
    (Story) => (
      <OakThemeProvider theme={oakDefaultTheme}>
        <Story />
      </OakThemeProvider>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof Component>;

export const Default: Story = {
  args: {
    title: "We are...",
    items: [
      {
        heading: "Built for the reality of teaching",
        textRaw: [
          {
            _key: "test1",
            _type: "block",
            children: [
              {
                _key: "span1",
                _type: "span",
                marks: [],
                text: "We get it. Time is tight, classes vary, and only teachers can know pupils best. That's why our materials are flexible tools to adapt, not scripts to follow: a starting point that supports your expertise and style.",
              },
            ],
            markDefs: [],
            style: "normal",
          },
        ],
        image: {
          asset: {
            url: "https://res.cloudinary.com/oak-web-application/image/upload/v1734523721/homepage/teacher-reading-map_glwhyh.svg",
          },
          altText: "test",
        },
      },
      {
        heading: "Expert created and quality assured",
        textRaw: [
          {
            _key: "test2",
            _type: "block",
            children: [
              {
                _key: "span2",
                _type: "span",
                marks: [],
                text: "Created by subject and curriculum experts, our resources are informed by the best available evidence of what works, aligned to the national curriculum and tested by real teachers.",
              },
            ],
            markDefs: [],
            style: "normal",
          },
        ],
        image: {
          asset: {
            url: "https://res.cloudinary.com/oak-web-application/image/upload/v1734523721/homepage/teacher-reading-map_glwhyh.svg",
          },
          altText: "test",
        },
      },
      {
        heading: "Free, and always will be",
        textRaw: [
          {
            _key: "test3",
            _type: "block",
            children: [
              {
                _key: "span3",
                _type: "span",
                marks: [],
                text: "We're funded by the Department for Education. No paywalls, package tiers, or hidden costs.",
              },
            ],
            markDefs: [],
            style: "normal",
          },
        ],
        image: {
          asset: {
            url: "https://res.cloudinary.com/oak-web-application/image/upload/v1734523721/homepage/teacher-reading-map_glwhyh.svg",
          },
          altText: "test",
        },
      },
      {
        heading: "Independent and optional",
        textRaw: [
          {
            _key: "test4",
            _type: "block",
            children: [
              {
                _key: "span4",
                _type: "span",
                marks: [],
                text: "Oak is by teachers, for teachers. Our board is publicly appointed, and our partners selected through an open process.",
              },
            ],
            markDefs: [],
            style: "normal",
          },
        ],
        image: {
          asset: {
            url: "https://res.cloudinary.com/oak-web-application/image/upload/v1734523721/homepage/teacher-reading-map_glwhyh.svg",
          },
          altText: "test",
        },
      },
      {
        heading: "Free, and always will be",
        textRaw: [
          {
            _key: "test5",
            _type: "block",
            children: [
              {
                _key: "span5",
                _type: "span",
                marks: [],
                text: "We're funded by the Department for Education. No paywalls, package tiers, or hidden costs.",
              },
            ],
            markDefs: [],
            style: "normal",
          },
        ],
        image: {
          asset: {
            url: "https://res.cloudinary.com/oak-web-application/image/upload/v1734523721/homepage/teacher-reading-map_glwhyh.svg",
          },
          altText: "test",
        },
      },
      {
        heading: "Independent and optional",
        textRaw: [
          {
            _key: "test6",
            _type: "block",
            children: [
              {
                _key: "span6",
                _type: "span",
                marks: [],
                text: "Oak is by teachers, for teachers. Our board is publicly appointed, and our partners selected through an open process.",
              },
            ],
            markDefs: [],
            style: "normal",
          },
        ],
        image: {
          asset: {
            url: "https://res.cloudinary.com/oak-web-application/image/upload/v1734523721/homepage/teacher-reading-map_glwhyh.svg",
          },
          altText: "test",
        },
      },
      {
        heading: "Free, and always will be",
        textRaw: [
          {
            _key: "test7",
            _type: "block",
            children: [
              {
                _key: "span7",
                _type: "span",
                marks: [],
                text: "We're funded by the Department for Education. No paywalls, package tiers, or hidden costs.",
              },
            ],
            markDefs: [],
            style: "normal",
          },
        ],
        image: {
          asset: {
            url: "https://res.cloudinary.com/oak-web-application/image/upload/v1734523721/homepage/teacher-reading-map_glwhyh.svg",
          },
          altText: "test",
        },
      },
      {
        heading: "Independent and optional",
        textRaw: [
          {
            _key: "test8",
            _type: "block",
            children: [
              {
                _key: "span8",
                _type: "span",
                marks: [],
                text: "Oak is by teachers, for teachers. Our board is publicly appointed, and our partners selected through an open process.",
              },
            ],
            markDefs: [],
            style: "normal",
          },
        ],
        image: {
          asset: {
            url: "https://res.cloudinary.com/oak-web-application/image/upload/v1734523721/homepage/teacher-reading-map_glwhyh.svg",
          },
          altText: "test",
        },
      },
    ],
  },
  render: (args) => <Component {...args} />,
};
