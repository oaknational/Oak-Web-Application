import type { Decorator } from "@storybook/react";

import { saveCountContext } from "@/context/SaveCount/SaveCountProvider";

const SaveCountDecorator: Decorator = (Story) => {
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
};

export default SaveCountDecorator;
