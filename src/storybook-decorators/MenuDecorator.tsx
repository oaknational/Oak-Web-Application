import type { Decorator } from "@storybook/react";

import { menuContext } from "@/context/Menu/MenuProvider";

const MenuDecorator: Decorator = (Story) => {
  const value = { open: false, openMenu: () => {}, closeMenu: () => {} };

  return (
    <menuContext.Provider value={value}>
      <Story />
    </menuContext.Provider>
  );
};

export default MenuDecorator;
