import type { Meta, StoryObj } from "@storybook/react";

import AnalyticsDecorator from "../../../../storybook-decorators/AnalyticsDecorator";
import lessonListingFixture from "../../../../node-lib/curriculum-api/fixtures/lessonListing.fixture";

import LessonListItem, { LessonListItemProps } from "./LessonListItem";

const lessonListing = lessonListingFixture();

const { lessons, ...lessonListingData } = lessonListing;

const propData = { ...lessonListingData, ...lessons[0] };

//@ts-expect-error: object is possibly 'undefined' but we know it's not
const props: LessonListItemProps = {
  ...propData,
  index: 123,
};

const meta: Meta<typeof LessonListItem> = {
  title: "Lists/Lesson List Item",
  component: LessonListItem,
  decorators: [AnalyticsDecorator],
};

export default meta;

type Story = StoryObj<typeof LessonListItem>;

export const Standard: Story = {
  render: ({ ...args }) => <LessonListItem {...args} />,
  args: { ...props },
};
