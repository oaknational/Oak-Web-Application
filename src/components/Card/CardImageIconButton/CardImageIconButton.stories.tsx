import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import image from "../../../../public/images/Image.png";

import Component from ".";

export default {
  title: "Cards",
  component: Component,
  argTypes: {
    icon: {
      defaultValue: "",
    },
    buttonLabel: {
      defaultValue: "Label",
    },
    buttonHref: {
      defaultValue: "/",
    },
    title: {
      defaultValue: "title",
    },
    text: {
      defaultValue: "A short snappy description about the card",
    },
    textCenter: {
      defaultValue: false,
    },
  },
} as ComponentMeta<typeof Component>;

const Template: ComponentStory<typeof Component> = (args) => {
  console.log(args);

  return (
    <div style={{ width: "300px" }}>
      <Component {...args} />
    </div>
  );
};

export const CardImageButton = Template.bind({});
CardImageButton.args = {
  title: "Title",
  text: "Short snappy description of what this card is about.",
  buttonHref: "/",
  buttonLabel: "Label",
  imageUrl: `/${image}`,
};

export const CardIconButton = Template.bind({});
CardIconButton.args = {
  title: "Title",
  text: "Short snappy description of what this card is about.",
  buttonHref: "/",
  buttonLabel: "Label",
  icon: "Download",
  iconPosition: "leading",
};
