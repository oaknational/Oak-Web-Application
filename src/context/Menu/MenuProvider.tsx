import { createContext, FC, useContext } from "react";

type MenuContext = {
  open: boolean;
};

export const menuContext = createContext<MenuContext | null>(null);

export const useToggleMenu = () => {
  const menuStatus = useContext(menuContext);
  const openStatus = menuStatus?.open || false;

  return {
    open: !openStatus,
  };
};

export const MenuProvider: FC = ({ children }) => {
  return (
    <menuContext.Provider value={{ open: false }}>
      {children}
    </menuContext.Provider>
  );
};

export default MenuProvider;
