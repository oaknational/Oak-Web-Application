import { ComponentStory, ComponentMeta } from "@storybook/react";
import { OverlayProvider } from "react-aria";

import Component from ".";

export default {
  title: "Lists/BioCardList",
  component: Component,
} as ComponentMeta<typeof Component>;

const Template: ComponentStory<typeof Component> = (args) => {
  return (
    <OverlayProvider>
      <Component {...args} />
    </OverlayProvider>
  );
};

export const BioCardList = Template.bind({});
BioCardList.args = {
  bios: [
    "Jack",
    "Joe",
    "Craig",
    "Verity",
    "Mitch",
    "Tomas",
    "Jim",
    "Ross",
    "Ian",
    "Matt",
  ].map((name, i) => ({ name, id: String(i), role: "Worker" })),
};
