import { OakThemeProvider, oakDefaultTheme } from "@oaknational/oak-components";
import { Meta, StoryObj } from "@storybook/react";
import { useArgs } from "@storybook/preview-api";

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
    const [, updateArgs] = useArgs();

    return (
      <OakThemeProvider theme={oakDefaultTheme}>
        <Component
          inputProps={{
            label: "Pick a state",
            id: "states",
            error: undefined,
          }}
          onChange={(value) => updateArgs({ value })}
          value={args.value}
        >
          {STATES.map((state) => {
            const key = state.toLocaleLowerCase();
            const textValue = state;

            const element = <div>🇺🇸 {textValue}</div>;
            return (
              <AutocompleteItem key={key} textValue={textValue}>
                {element}
              </AutocompleteItem>
            );
          })}
        </Component>
      </OakThemeProvider>
    );
  },
};
