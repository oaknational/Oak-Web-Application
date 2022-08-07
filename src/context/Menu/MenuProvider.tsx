import { createContext, useContext, FC, useState } from "react";

type MenuContext = {
  open: boolean;
  toggleMenu: () => void;
};

const menuContext = createContext<MenuContext | null>(null);

export const MenuProvider: FC = ({ children }) => {
  const [open, setOpen] = useState(false);

  const menuValue: MenuContext = {
    open,
    toggleMenu: () => {
      setOpen(!open);
    },
  };

  return (
    <menuContext.Provider value={menuValue}>{children}</menuContext.Provider>
  );
};

export const useMenuContext = () => {
  const menuValue = useContext(menuContext);

  if (!menuValue) {
    throw new Error("useMenuContext() called outside of menu provider");
  }

  return menuValue;
};

export default MenuProvider;
