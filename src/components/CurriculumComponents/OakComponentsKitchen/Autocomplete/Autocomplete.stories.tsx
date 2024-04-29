import { OakThemeProvider, oakDefaultTheme } from "@oaknational/oak-components";
import { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";

import { STATES } from "./seeds";

import Autocomplete, { AutocompleteItem } from ".";

const meta: Meta<typeof Autocomplete> = {
  component: Autocomplete,
  argTypes: {},
};

export default meta;
type Story = StoryObj<typeof Autocomplete>;

const TestComponent = () => {
  const [state, setState] = useState("");

  return (
    <OakThemeProvider theme={oakDefaultTheme}>
      <Autocomplete
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
      </Autocomplete>
    </OakThemeProvider>
  );
};

export const AutocompleteStory: Story = {
  render: TestComponent,
};
