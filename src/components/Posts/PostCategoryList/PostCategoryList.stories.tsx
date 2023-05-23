import { Meta, StoryObj } from "@storybook/react";

import AnalyticsDecorator from "../../../storybook-decorators/AnalyticsDecorator";

import Component from ".";

const meta: Meta<typeof Component> = {
  title: "Blogs & Webinars/PostCategoryList",
  decorators: [AnalyticsDecorator],
  component: Component,
};

export default meta;
type Story = StoryObj<typeof Component>;

export const PostCategoryList: Story = {
  args: {
    page: "blog-index",
    categories: [
      { slug: "oak-updates", title: "Oak updates" },
      { slug: "lesson-planning", title: "Lesson planning" },
      { slug: "teaching-learning", title: "Teaching and learning" },
      { slug: "research", title: "Research and insights" },
    ],
    selectedCategorySlug: null,
  },
  render: (args) => {
    return <Component {...args} />;
  },
};
