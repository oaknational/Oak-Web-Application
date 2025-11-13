"use client";
import { createContext, FC, useCallback, useState } from "react";

type MenuContext = {
  open: boolean;
  openMenu: () => void;
  closeMenu: () => void;
};

export const menuContext = createContext<MenuContext | null>(null);

export const MenuProvider: FC<{
  children?: React.ReactNode;
}> = ({ children }) => {
  const [open, setOpen] = useState(false);

  const openMenu = useCallback(() => {
    setOpen(true);
  }, [setOpen]);

  const closeMenu = useCallback(() => {
    setOpen(false);
  }, [setOpen]);

  const menuValue: MenuContext = {
    open,
    openMenu,
    closeMenu,
  };

  return (
    <menuContext.Provider value={menuValue}>{children}</menuContext.Provider>
  );
};

export default MenuProvider;
