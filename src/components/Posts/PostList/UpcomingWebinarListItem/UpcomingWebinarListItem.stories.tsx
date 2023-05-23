import type { Meta, StoryObj } from "@storybook/react";

import Box from "../../../Box";

import Component from ".";

const meta: Meta<typeof Component> = {
  title: "Blogs & Webinars/Post List/UpcomingWebinarListItem",
  component: Component,
  decorators: [
    (Story) => (
      <Box $position="relative" $maxWidth={720} $ma="auto">
        <Story />
      </Box>
    ),
  ],
  argTypes: { signUpOnClick: { action: "clicked" } },
};

export default meta;
type Story = StoryObj<typeof Component>;

export const UpcomingWebinarListItem: Story = {
  args: {
    titleTag: "h3",
    title: "Why are teachers still using Oak?",
    summary:
      "We know schools are facing yet another challenging term, with increasing numbers of staff and pupils isolating due to Covid, isolating due to Covid, isolating due to Covid, isolating due to Covid",
    date: "2052-03-31T14:30:00.000Z",
    slug: "why-oak",
    signUpHref: "https://example.com",
  },
};
