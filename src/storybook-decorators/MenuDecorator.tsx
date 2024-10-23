import { StoryFn } from "@storybook/react";

import { menuContext } from "@/context/Menu/MenuProvider";

export default function MenuDecorator(Story: StoryFn) {
  const value = { open: false, openMenu: () => {}, closeMenu: () => {} };

  return (
    <menuContext.Provider value={value}>
      <Story />
    </menuContext.Provider>
  );
}
