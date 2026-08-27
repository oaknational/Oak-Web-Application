import { Meta, StoryObj } from "@storybook/nextjs";

import Component from ".";

import TeacherBrowseAnalyticsDecorator from "@/storybook-decorators/TeacherBrowseAnalyticsDecorator";
import CookieConsentDecorator from "@/storybook-decorators/CookieConsentDecorator";

const meta: Meta<typeof Component> = {
  component: Component,
  decorators: [TeacherBrowseAnalyticsDecorator, CookieConsentDecorator],
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
