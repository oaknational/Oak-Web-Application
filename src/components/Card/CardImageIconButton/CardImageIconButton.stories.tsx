import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import image from "../../../../public/images/Image.png";

import Component from ".";

export default {
  title: "Cards",
  component: Component,
  argTypes: {
    // icon: {
    //   defaultValue: "",
    // },
    buttonLabel: {
      defaultValue: "Label",
    },
    buttonHref: {
      defaultValue: "/",
    },
    // title: {
    //   defaultValue: "title",
    // },
    // text: {
    //   defaultValue: "A short snappy description about the card",
    // },
    // textCenter: {
    //   defaultValue: false,
    // },
  },
} as ComponentMeta<typeof Component>;

const Template: ComponentStory<typeof Component> = (args) => {
  console.log(args);

  return (
    <div style={{ width: "308px" }}>
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
  imageUrl: "/" + image,
  textCenter: false,
};

export const CardIconButton = Template.bind({});
CardIconButton.args = {
  title: "Title",
  text: "Short snappy description of what this card is about.",
  buttonHref: "/",
  buttonLabel: "Label",
  icon: "Download",
  iconPosition: "aboveTitle",
  textCenter: true,
};

export const CardLeadingIconButton = Template.bind({});
CardLeadingIconButton.args = {
  title: "Need Some Help?",
  text: "Preview, plan and customise each element of our lessons to meet your needs - whether inside and outside the classroom.",
  buttonHref: "/",
  buttonLabel: "Visit Help Centre",
  icon: "OpenExternal",
  iconPosition: "leading",
  textCenter: false,
};
