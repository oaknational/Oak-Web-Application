import { createContext, FC, useCallback, useState } from "react";
import { useRouter } from "next/router";

import { menuSections } from "../../browser-lib/fixtures/menuSections";

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
  const { pathname } = useRouter();
  const displayMenu = pathname.startsWith("/beta/teachers");

  const openMenu = useCallback(() => {
    setOpen(true);
  }, [setOpen]);

  const closeMenu = useCallback(() => {
    setOpen(false);
  }, [setOpen]);

  if (displayMenu) {
    if (!menuSections.large[0]) {
      return null;
    }
    menuSections.large[0].linkText = "Home (early access)";
    menuSections.large[0].resolveOakHrefProps.page = "home";
    if ("viewType" in menuSections.large[0].resolveOakHrefProps) {
      menuSections.large[0].resolveOakHrefProps.viewType = "teachers";
    }
  } else {
    if (!menuSections.large[0]) {
      return null;
    }
    menuSections.large[0].linkText = "Home";
    menuSections.large[0].resolveOakHrefProps.page = "home";
    if ("viewType" in menuSections.large[0].resolveOakHrefProps) {
      menuSections.large[0].resolveOakHrefProps.viewType = null;
    }
  }

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
