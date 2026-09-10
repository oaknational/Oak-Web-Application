import type { Meta, StoryObj } from "@storybook/nextjs";
import { OakBox } from "@oaknational/oak-components";

import Component from ".";

const meta: Meta<typeof Component> = {
  component: Component,
  decorators: [
    (Story) => (
      <OakBox $position="relative" $maxWidth={"spacing-640"} $ma="auto">
        <Story />
      </OakBox>
    ),
  ],
  argTypes: { signUpOnClick: { action: "clicked" } },
};

export default meta;
type Story = StoryObj<typeof Component>;

export const PostListUpcomingWebinarListItem: Story = {
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
