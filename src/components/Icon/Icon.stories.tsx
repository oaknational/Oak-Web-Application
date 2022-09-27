import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import { ICON_NAMES } from "../SpriteSheet/IconSvgs";
import { GRAPHIC_NAMES } from "../SpriteSheet/GraphicSvgs";
import { LESSON_ELEMENT_NAMES } from "../SpriteSheet/LessonElementSvgs";
import { Heading } from "../Typography";

import Component from "./Icon";

export default {
  title: "Media/Icon",
  component: Component,
  argTypes: {},
} as ComponentMeta<typeof Component>;

const Template: ComponentStory<typeof Component> = (args) => (
  <>
    <Heading $font={"heading-5"} $mb={24} tag="h2">
      Icons
    </Heading>
    {ICON_NAMES.map((name) => {
      return <Component {...args} name={name} />;
    })}

    <Heading $font={"heading-5"} $mv={24} tag="h2">
      Graphics
    </Heading>
    {GRAPHIC_NAMES.map((name) => {
      return <Component {...args} name={name} />;
    })}
    <Heading $font={"heading-5"} $mv={24} tag="h2">
      Lesson Elements
    </Heading>
    {LESSON_ELEMENT_NAMES.map((name) => {
      return <Component {...args} name={name} />;
    })}
  </>
);

export const Icon = Template.bind({});

Icon.args = {
  name: "Back10",
  size: 48,
};
