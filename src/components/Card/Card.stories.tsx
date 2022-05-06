import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import cardImage from "../../../public/Image.png";

import Card from "./Card";
import CardText from "./CardText";
import CardButton from "./CardButton";
import CardContainer from "./CardContainer";
import CardImage from "./CardImage";

export default {
  title: "Components/Card",
  component: Card,
  argTypes: {},
} as ComponentMeta<typeof Card>;

const Template: ComponentStory<typeof Card> = () => (
  <div>
    <h1>Card</h1>
    <Card>
      <h2>Card title</h2>
      <p>You can put anything you like in here.</p>
    </Card>
    <div style={{ width: "308px" }}>
      <div>
        <CardContainer>
          <CardImage imageUrl={cardImage} />
          <Card radius={false}>
            <CardText>Title</CardText>
            <CardText variant={"body3"}>
              Short snappy description of what this card is about.
            </CardText>
            <CardButton href="/" label="Label" />
          </Card>
        </CardContainer>

        <p>-----</p>

        <Card>
          <CardText alignCenter icon="Star" iconPosition="aboveTitle">
            Title
          </CardText>
          <CardText alignCenter variant={"body3"}>
            Short snappy description of what this card is about.
          </CardText>
          <CardButton href="/" label="Label" />
        </Card>
        <p>---</p>
        <Card>
          <CardText icon="Download" iconPosition="before">
            Need some help?
          </CardText>
          <CardText variant={"body3"}>
            Preview, plan and customise each element of our lessons to meet your
            needs - whether inside and outside the classroom.
          </CardText>
          <CardButton href="/" label="Label" />
        </Card>
      </div>
    </div>
  </div>
);

export const CardDefault = Template.bind({});
