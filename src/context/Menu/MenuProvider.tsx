import { createContext, FC, useState } from "react";

type MenuContext = {
  open: boolean;
  toggleMenu: () => void;
};

export const menuContext = createContext<MenuContext | null>(null);

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

export default MenuProvider;
