import { createContext, FC, useState } from "react";

type MenuContext = {
  open: boolean;
  toggleMenu: () => void;
};

export const menuContext = createContext<MenuContext>({
  open: false,
  toggleMenu: () => null,
});

export const MenuProvider: FC = ({ children }) => {
  const [open, setOpen] = useState(false);
  const toggleMenu = () => {
    setOpen(!open);
  };

  return (
    <menuContext.Provider value={{ open, toggleMenu }}>
      {children}
    </menuContext.Provider>
  );
};

export default MenuProvider;
