import { ComponentStory, ComponentMeta } from "@storybook/react";

import Component from ".";

export default {
  title: "Blogs & Webinars/BlogCategoryList",
  component: Component,
} as ComponentMeta<typeof Component>;

const Template: ComponentStory<typeof Component> = (args) => {
  return <Component {...args} />;
};

export const BlogCategoryList = Template.bind({});
BlogCategoryList.args = {
  categories: [
    { slug: "oak-updates", title: "Oak updates" },
    { slug: "lesson-planning", title: "Lesson planning" },
    { slug: "teaching-learning", title: "Teaching and learning" },
    { slug: "research", title: "Research and insights" },
  ],
  selectedCategorySlug: null,
};
