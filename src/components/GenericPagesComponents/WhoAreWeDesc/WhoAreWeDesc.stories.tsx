import { Meta, StoryObj } from "@storybook/nextjs";

import { WhoAreWeDesc as Component } from ".";

import { oakDefaultTheme, OakThemeProvider } from "@oaknational/oak-components";


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
        title: "Built for the reality of teaching",
        text: "We get it. Time is tight, classes vary, and only teachers can know pupils best. That’s why our materials are flexible tools to adapt, not scripts to follow: a starting point that supports your expertise and style.",
        image: {
          asset: {
            url: "https://res.cloudinary.com/oak-web-application/image/upload/v1734523721/homepage/teacher-reading-map_glwhyh.svg",
          },
          altText: "test",
        },
      },
      {
        title: "Expert created and quality assured",
        text: "Created by subject and curriculum experts, our resources are informed by the best available evidence of what works, aligned to the national curriculum and tested by real teachers.",
        image: {
          asset: {
            url: "https://res.cloudinary.com/oak-web-application/image/upload/v1734523721/homepage/teacher-reading-map_glwhyh.svg",
          },
          altText: "test",
        },
      },
      {
        title: "Free, and always will be",
        text: "We’re funded by the Department for Education. No paywalls, package tiers, or hidden costs.",
        image: {
          asset: {
            url: "https://res.cloudinary.com/oak-web-application/image/upload/v1734523721/homepage/teacher-reading-map_glwhyh.svg",
          },
          altText: "test",
        },
      },
      {
        title: "Independent and optional",
        text: "Oak is by teachers, for teachers. Our board is publicly appointed, and our partners selected through an open process.",
        image: {
          asset: {
            url: "https://res.cloudinary.com/oak-web-application/image/upload/v1734523721/homepage/teacher-reading-map_glwhyh.svg",
          },
          altText: "test",
        },
      },
      {
        title: "Free, and always will be",
        text: "We’re funded by the Department for Education. No paywalls, package tiers, or hidden costs.",
        image: {
          asset: {
            url: "https://res.cloudinary.com/oak-web-application/image/upload/v1734523721/homepage/teacher-reading-map_glwhyh.svg",
          },
          altText: "test",
        },
      },
      {
        title: "Independent and optional",
        text: "Oak is by teachers, for teachers. Our board is publicly appointed, and our partners selected through an open process.",
        image: {
          asset: {
            url: "https://res.cloudinary.com/oak-web-application/image/upload/v1734523721/homepage/teacher-reading-map_glwhyh.svg",
          },
          altText: "test",
        },
      },
      {
        title: "Free, and always will be",
        text: "We’re funded by the Department for Education. No paywalls, package tiers, or hidden costs.",
        image: {
          asset: {
            url: "https://res.cloudinary.com/oak-web-application/image/upload/v1734523721/homepage/teacher-reading-map_glwhyh.svg",
          },
          altText: "test",
        },
      },
      {
        title: "Independent and optional",
        text: "Oak is by teachers, for teachers. Our board is publicly appointed, and our partners selected through an open process.",
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
