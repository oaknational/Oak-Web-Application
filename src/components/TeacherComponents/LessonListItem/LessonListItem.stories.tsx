import type { Meta, StoryObj } from "@storybook/react";

import LessonListItem, { LessonListItemProps } from "./LessonListItem";

import AnalyticsDecorator from "@/storybook-decorators/AnalyticsDecorator";
import lessonListingFixture from "@/node-lib/curriculum-api-2023/fixtures/lessonListing.fixture";

const lessonListing = lessonListingFixture();

const { lessons, ...lessonListingData } = lessonListing;

const propData = { ...lessonListingData, ...lessons[0] };

//@ts-expect-error: object is possibly 'undefined' but we know it's not
const props: LessonListItemProps = {
  ...propData,
  index: 123,
};

const meta: Meta<typeof LessonListItem> = {
  component: LessonListItem,
  decorators: [AnalyticsDecorator],
};

export default meta;

type Story = StoryObj<typeof LessonListItem>;

export const Standard: Story = {
  render: ({ ...args }) => <LessonListItem {...args} />,
  args: { ...props },
};

export const WithCopyrightMaterial: Story = {
  render: ({ ...args }) => <LessonListItem {...args} />,
  args: {
    ...props,
    hasCopyrightMaterial: true,
  },
};
