import { Meta, StoryObj } from "@storybook/nextjs";

import { AboutCalloutWithCta as Component } from ".";

const meta: Meta<typeof Component> = {
  component: Component,
  tags: ["autodocs"],
  title: "Components/GenericPagesComponents/AboutCalloutWithCta",
  args: {
    link: {
      text: "Get in touch with an expert",
      href: "https://share.hsforms.com/2yBT-92_WT6CvX1b6L3Iw8Qbvumd",
    },
  },
  argTypes: {},
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => <Component {...args} />,
};

export const AsHeader: Story = {
  args: {
    headingTag: "h1",
    title: "Join the Oak research panel",
    text: "Your feedback is essential to help us understand the realities of teaching and learning. By listening to teachers like you, we learn about your preferences, challenges and needs, and can use these insights to shape Oak curriculum resources, lessons and tools.",
    link: {
      text: "Join the research panel",
      href: "https://share.hsforms.com/2yBT-92_WT6CvX1b6L3Iw8Qbvumd",
    },
    image: {
      asset: {
        url: "https://cdn.sanity.io/images/cuvjke51/production/1b28197a71f5e06f82f71f328e0eb607aca8b275-632x422.png",
        _id: "image-1b28197a71f5e06f82f71f328e0eb607aca8b275-632x422-png",
      },
    },
    $pv: "spacing-32",
    $pb: ["spacing-56", "spacing-72", "spacing-72"],
    hideImageOnMobile: true,
  },
};
