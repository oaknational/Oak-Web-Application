import { OakThemeProvider, oakDefaultTheme } from "@oaknational/oak-components";
import { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";

import { STATES } from "./seeds";

import OakAutocomplete, { OakAutocompleteItem } from ".";

const meta: Meta<typeof OakAutocomplete> = {
  component: OakAutocomplete,
  argTypes: {},
};

export default meta;
type Story = StoryObj<typeof OakAutocomplete>;

const TestComponent = () => {
  const [state, setState] = useState("");

  return (
    <OakThemeProvider theme={oakDefaultTheme}>
      <OakAutocomplete
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
            <OakAutocompleteItem key={key} textValue={textValue}>
              {element}
            </OakAutocompleteItem>
          );
        })}
      </OakAutocomplete>
    </OakThemeProvider>
  );
};

export const OakAutocompleteStory: Story = {
  render: TestComponent,
};
