import { OakThemeProvider, oakDefaultTheme } from "@oaknational/oak-components";
import { Meta, StoryObj } from "@storybook/nextjs";

import { STATES } from "./seeds";

import Component, { AutocompleteItem } from ".";

const meta: Meta<typeof Component> = {
  component: Component,
  argTypes: {},
};

export default meta;
type Story = StoryObj<typeof Component>;

export const Autocomplete: Story = {
  args: {
    value: "",
  },
  render: function Render(args) {
    return (
      <OakThemeProvider theme={oakDefaultTheme}>
        <Component
          inputProps={{
            label: "Pick a state",
            id: "states",
            error: undefined,
          }}
          onChange={(value) => console.log({ value })}
          value={args.value}
        >
          {STATES.map((state) => {
            const key = state.toLocaleLowerCase();
            const textValue = state;

            return (
              <AutocompleteItem key={key} textValue={textValue}>
                <div>🇺🇸 {textValue}</div>
              </AutocompleteItem>
            );
          })}
        </Component>
      </OakThemeProvider>
    );
  },
};
