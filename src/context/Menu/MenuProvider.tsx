import { createContext, FC, useCallback, useState } from "react";

type MenuContext = {
  open: boolean;
  toggleMenu: () => void;
  closeMenu: () => void;
};

export const menuContext = createContext<MenuContext | null>(null);

export const MenuProvider: FC = ({ children }) => {
  const [open, setOpen] = useState(false);

  const toggleMenu = useCallback(() => {
    setOpen((_open) => !_open);
  }, [setOpen]);

  const closeMenu = useCallback(() => {
    setOpen(false);
  }, [setOpen]);

  const menuValue: MenuContext = {
    open,
    toggleMenu,
    closeMenu,
  };

  return (
    <menuContext.Provider value={menuValue}>{children}</menuContext.Provider>
  );
};

export default MenuProvider;
