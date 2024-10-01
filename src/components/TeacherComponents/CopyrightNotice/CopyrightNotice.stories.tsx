import Component from ".";

export default {
  component: Component,
  argTypes: {
    showPostAlbCopyright: { control: "radio", options: [true, false] },
  },
};

export const CopyrightNotice = {};
