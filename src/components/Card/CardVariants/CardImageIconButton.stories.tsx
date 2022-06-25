import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import image from "../../../../public/images/Image.png";

import Component from ".";

export default {
  title: "Cards/Variants/Image Icon Button",
  component: Component,
  argTypes: {
    buttonLabel: {
      defaultValue: "Label",
    },
    buttonHref: {
      defaultValue: "/",
    },
    iconPosition: {
      options: ["leading", "trailing", "aboveTitle"],
    },
  },
} as ComponentMeta<typeof Component>;

const Template: ComponentStory<typeof Component> = (args) => {
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
  href: "/",
  label: "Label",
  imageSrc: "/" + image,
  textCenter: false,
  tag: "h4",
};

export const CardIconButton = Template.bind({});
CardIconButton.args = {
  title: "Title",
  text: "Short snappy description of what this card is about.",
  href: "/",
  label: "Label",
  icon: "Download",
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  iconPosition: "aboveTitle",
  textCenter: true,
  tag: "h4",
};

export const CardLeadingIconButton = Template.bind({});
CardLeadingIconButton.args = {
  title: "Need Some Help?",
  text: "Preview, plan and customise each element of our lessons to meet your needs - whether inside and outside the classroom.",
  href: "/",
  label: "Visit Help Centre",
  icon: "OpenExternal",
  iconPosition: "leading",
  textCenter: false,
  tag: "h4",
};
