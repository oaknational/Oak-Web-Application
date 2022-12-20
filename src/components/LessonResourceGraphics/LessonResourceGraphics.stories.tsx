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
    { title: "presentation", resourceCount: 1 },
    { title: "worksheet", resourceCount: 2 },
    { title: "quiz", resourceCount: 3 },
    { title: "video", resourceCount: 2 },
  ],
};
export const LessonResourceGraphicMissing = Template.bind({});

LessonResourceGraphicMissing.args = {
  items: [
    { title: "presentation", resourceCount: 2 },
    { title: "quiz", resourceCount: 1 },
  ],
};
