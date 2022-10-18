import { createContext, FC, useCallback, useState } from "react";

const isProduction = process.env.NEXT_PUBLIC_RELEASE_STAGE === "production";

type MenuContext = {
  open: boolean;
  toggleMenu: (label?: string) => void;
  closeMenu: (label?: string) => void;
};

export const menuContext = createContext<MenuContext | null>(null);

export const MenuProvider: FC = ({ children }) => {
  const [open, setOpen] = useState(false);

  const toggleMenu = useCallback(
    (label?: string) => {
      if (label !== undefined && !isProduction) {
        console.log(label);
      }
      setOpen((_open) => !_open);
    },
    [setOpen]
  );

  const closeMenu = useCallback(
    (label?: string) => {
      if (label !== undefined && !isProduction) {
        console.log(label);
      }
      setOpen(false);
    },
    [setOpen]
  );

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
