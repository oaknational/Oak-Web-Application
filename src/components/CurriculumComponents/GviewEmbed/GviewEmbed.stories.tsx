import { Meta, StoryObj } from "@storybook/react";

import Component from ".";

const meta: Meta<typeof Component> = {
  component: Component,
  argTypes: {
    url: {
      defaultValue:
        "https://msopenspecs.azureedge.net/files/MS-DOCX/%5bMS-DOCX%5d-240416.docx",
    },
  },
};

export default meta;
type Story = StoryObj<typeof Component>;

export const GviewEmbed: Story = {
  args: {
    url: "https://msopenspecs.azureedge.net/files/MS-DOCX/%5bMS-DOCX%5d-240416.docx",
  },
  render: (args) => <Component {...args} />,
};
