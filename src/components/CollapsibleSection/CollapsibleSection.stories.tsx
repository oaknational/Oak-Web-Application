import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import Card from "../Card";
import { Heading } from "../Typography";

import Component from ".";

export default {
  title: "Interactive/Collapsible Section",
  component: Component,
  argTypes: {},
} as ComponentMeta<typeof Component>;

const Template: ComponentStory<typeof Component> = () => {
  return (
    <Component
      title={"Slide deck"}
      headingTag={"h2"}
      startOpen={false}
      buttons={[
        {
          icon: "download",
          onClick: () => console.log("downloads"),
          ariaLabel: "Download lesson presentation",
        },
        {
          icon: "share",
          onClick: () => console.log("share"),
          ariaLabel: "Share lesson presentation",
        },
      ]}
    >
      <Card $background={"grey4"}>
        <Heading $font={"heading-6"} tag={"h2"}>
          Use Oak in Beta
        </Heading>
      </Card>
    </Component>
  );
};

export const CollapsibleSection = Template.bind({});
