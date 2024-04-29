import { OakThemeProvider, oakDefaultTheme } from "@oaknational/oak-components";
import { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";

import { STATES } from "./seeds";

import Component, { AutocompleteItem } from ".";

const meta: Meta<typeof Component> = {
  component: Component,
  argTypes: {},
};

export default meta;
type Story = StoryObj<typeof Component>;

const TestComponent = () => {
  const [state, setState] = useState("");

  return (
    <OakThemeProvider theme={oakDefaultTheme}>
      <Component
        inputProps={{
          label: "Pick a state",
          id: "states",
          error: undefined,
        }}
        onChange={setState}
        value={state}
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
};

export const Autocomplete: Story = {
  render: TestComponent,
};
