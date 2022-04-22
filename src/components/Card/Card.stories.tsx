import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import Card from "./Card";

export default {
  title: "Components/Card",
  component: Card,
  argTypes: {},
} as ComponentMeta<typeof Card>;

const Template: ComponentStory<typeof Card> = () => (
  <div>
    <Card>
      <h2>Card title</h2>
      <p>You can put anything you like in here.</p>
    </Card>
  </div>
);

export const CardDefault = Template.bind({});
