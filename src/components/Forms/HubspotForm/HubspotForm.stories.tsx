import { ComponentStory, ComponentMeta } from "@storybook/react";

import Grid, { GridArea } from "../../Grid";

import Component from ".";

export default {
  title: "Forms/Hubspot Form",
  component: Component,
  argTypes: {},
  parameters: {
    backgrounds: {
      default: "dark",
    },
  },
} as ComponentMeta<typeof Component>;

const Template: ComponentStory<typeof Component> = (args) => (
  <Grid>
    <GridArea $colSpan={[12, 6]}>
      <Component {...args} />
    </GridArea>
  </Grid>
);

export const HubspotForm = Template.bind({});
HubspotForm.args = {
  form: {
    id: " 000",
    fields: [
      {
        name: "user_type",
        label: "User Type",
        type: "select",
        required: true,
      },
      {
        name: "school",
        label: "School",
        type: "string",
        required: false,
        renderWhen: [
          {
            field: "user_type",
            operator: "in",
            value: ["Teacher"],
          },
        ],
      },
    ],
  },
};

