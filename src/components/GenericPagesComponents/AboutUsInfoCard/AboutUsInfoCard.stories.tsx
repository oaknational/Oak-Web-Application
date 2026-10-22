import { Meta, StoryObj } from "@storybook/nextjs";
import { oakIconNames } from "@oaknational/oak-components";

import AboutUsInfoCard from "./AboutUsInfoCard";

import { portableTextFromString } from "@/__tests__/__helpers__/cms";
import { PortableTextWithDefaults } from "@/components/SharedComponents/PortableText";

const meta: Meta<typeof AboutUsInfoCard> = {
  component: AboutUsInfoCard,
  tags: ["autodocs"],
  argTypes: {
    iconName: {
      control: "select",
      options: oakIconNames,
    },
  },
  parameters: {
    iconWidth: {
      default: "spacing-64",
    },
    iconHeight: {
      default: "spacing-72",
    },
    backgrounds: {
      default: "white",
    },
  },
};

export default meta;

type Story = StoryObj<typeof AboutUsInfoCard>;

export const WithIconName: Story = {
  args: {
    children: "This is some information.",
    iconName: "search",
    background: "bg-decorative1-very-subdued",
  },
  parameters: {
    controls: {
      icon: { table: { disable: true } },
    },
  },
};

export const WithIconAssetAndPortableText: Story = {
  args: {
    children: (
      <PortableTextWithDefaults
        value={portableTextFromString("This is some information.")}
      />
    ),
    icon: {
      asset: {
        _id: "image-0123c8cd16c86e1095af18a8f65d427d1c8dd2f9-80x80-svg",
        url: "https://cdn.sanity.io/images/cuvjke51/production/0123c8cd16c86e1095af18a8f65d427d1c8dd2f9-80x80.svg",
      },
    },
    iconHeight: "spacing-40",
    iconWidth: "spacing-40",
  },
  argTypes: {
    iconName: { table: { disable: true } },
  },
};
