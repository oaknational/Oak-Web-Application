import { ComponentStory, ComponentMeta } from "@storybook/react";

import Component from "./LessonResourceGraphics";

export default {
  title: "Element/Lesson Resource Graphic ",
  component: Component,
} as ComponentMeta<typeof Component>;

const Template: ComponentStory<typeof Component> = (args) => (
  <Component {...args} />
);

export const LessonResourceGraphic = Template.bind({});

LessonResourceGraphic.args = {
  items: [
    { title: "presentation", href: "/", resourceCount: 1 },
    { title: "worksheet", href: "/", resourceCount: 2 },
    { title: "quiz", href: "/", resourceCount: 3 },
    { title: "video", href: "/", resourceCount: 2 },
  ],
};
export const LessonResourceGraphicMissing = Template.bind({});

LessonResourceGraphicMissing.args = {
  items: [
    { title: "presentation", href: "/", resourceCount: 2 },
    { title: "quiz", href: "/", resourceCount: 1 },
  ],
};
