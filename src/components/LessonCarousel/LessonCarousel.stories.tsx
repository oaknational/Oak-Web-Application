import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import unit from "../../browser-lib/fixtures/unitLessons";

import Component from ".";

export default {
  title: "Lists/Lesson Carousel",
  component: Component,
  argTypes: {},
} as ComponentMeta<typeof Component>;

const Template: ComponentStory<typeof Component> = (args) => {
  return (
    <div style={{ backgroundColor: "lightgray" }}>
      <Component {...args} unit={unit}></Component>
    </div>
  );
};

export const LessonCarousel = Template.bind({});

LessonCarousel.args = {
  currentLesson: 3,
  titleTag: "h2",
  cardTitleTag: "h3",
};
