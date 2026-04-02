import { StoryFn } from "@storybook/react";

import { saveCountContext } from "@/context/SaveCount/SaveCountProvider";

export default function SaveCountDecorator(Story: StoryFn) {
  const SaveCountProvider = saveCountContext.Provider;

  const value = {
    savedUnitsCount: 0,
    incrementSavedUnitsCount: () => console.log("save +1"),
    decrementSavedUnitsCount: () => console.log("save -1"),
    setSavedUnitsCount: () => console.log("save units count"),
  };

  return (
    <SaveCountProvider value={value}>
      <Story />
    </SaveCountProvider>
  );
}
