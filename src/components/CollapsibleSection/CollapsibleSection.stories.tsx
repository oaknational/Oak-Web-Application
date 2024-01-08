import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import Component from ".";

import { Heading } from "@/components/SharedComponents/Typography";
import Card from "@/components/SharedComponents/Card";

export default {
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
          onClick: () => {
            console.log("downloads");
          },
          ariaLabel: "Download lesson presentation",
        },
        {
          icon: "share",
          onClick: () => {
            console.log("share");
          },
          ariaLabel: "Share lesson presentation",
        },
      ]}
    >
      <Card $background={"grey40"}>
        <Heading $font={"heading-6"} tag={"h2"}>
          Use Oak in Beta
        </Heading>
      </Card>
    </Component>
  );
};

export const CollapsibleSection = Template.bind({});
