import { ComponentStory, ComponentMeta } from "@storybook/react";

import { PostIndexLinkProps } from "../../../common-lib/urls";

import useCategoryFilterList from "./useCategoryFilterList";

import Component from ".";

export default {
  title: "Filters/Category Filter List",
  component: Component,
} as ComponentMeta<typeof Component>;

const Template: ComponentStory<typeof Component> = (args) => {
  const props = useCategoryFilterList<PostIndexLinkProps>({
    selectedKey: "oak-updates",
    getKey: (link) => link.category,
  });
  // Can't get storybook types to play nicely with generic component
  // eslint-disable-next-line
  // @ts-ignore
  return <Component<PostIndexLinkProps> {...args} {...props} />;
};

export const CategoryFilterList = Template.bind({});
CategoryFilterList.args = {
  categories: [
    {
      linkProps: { page: "blog-index", category: "oak-updates" },
      label: "Oak updates",
    },
    {
      linkProps: { page: "blog-index", category: "lesson-planning" },
      label: "Lesson planning",
    },
    {
      linkProps: { page: "blog-index", category: "teaching-learning" },
      label: "Teaching and learning",
    },
    {
      linkProps: { page: "blog-index", category: "research" },
      label: "Research and insights",
    },
  ],
};
