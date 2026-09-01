import { Meta, StoryObj } from "@storybook/nextjs";

import { OaksImpactHeader as Component } from ".";

const meta = {
  component: Component,
  tags: ["autodocs"],
  title: "Components/GenericPagesComponents/OaksImpactHeader",
  argTypes: {},
} satisfies Meta<typeof Component>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    mediaDescription: "How Oak is making an impact in schools across England.",
    video: {
      video: {
        asset: {
          assetId: "Kx9emKZOPdDNfMB2q202Oksaf7wHHywaXlcG3YURSTEw",
          playbackId: "VUW02Q7BTn3t11L027yUl9iDWwtOqdMgMyUxmo3O65p00k",
          thumbTime: 82,
        },
      },
      title: "Test Video",
    },
    title: "Oak's impact",
    body: "How our world-class curriculum is making a difference in schools and trusts across the country.",
  },
  render: (args) => <Component {...args} />,
};

export const Photo: Story = {
  args: {
    mediaDescription: "The thinking behind Oak lessons",
    image:
      "https://sanity-asset-cdn.thenational.academy/images/cuvjke51/production/b81ee19a35baa3192360a210fda34cc9b21f4fd6-5824x3264.jpg",
    title: "The thinking behind Oak lessons",
    body: "See how our lessons are designed to support learning - and make the most of them in your classroom.",
    backButton: true,
    backButtonLabel: "Back to lesson",
    href: "/",
  },
  render: (args) => <Component {...args} />,
};
