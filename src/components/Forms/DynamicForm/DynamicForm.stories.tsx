import { ComponentStory, ComponentMeta } from "@storybook/react";

import Component from ".";

import Grid, { GridArea } from "@/components/SharedComponents/Grid";


export default {
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

export const DynamicForm = Template.bind({});
DynamicForm.args = {
  form: {
    formId: "abc-def",
    portalId: 12345,
    submitButtonLabel: "Submit label",
    successMessage: "Success message",
    fields: [
      {
        name: "name",
        label: "Name",
        type: "string",
        required: true,
      },
      {
        name: "user_type",
        label: "User Type",
        type: "select",
        required: true,
        options: [
          { label: "Teacher", value: "Teacher" },
          { label: "Pupil", value: "Pupil" },
          { label: "Parent", value: "Parent" },
        ],
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
