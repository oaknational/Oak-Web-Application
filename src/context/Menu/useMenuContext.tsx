import { useContext } from "react";

import { menuContext } from "./MenuProvider";

const useMenuContext = () => {
  const menuValue = useContext(menuContext);

  if (!menuValue) {
    throw new Error("useMenuContext() called outside of menu provider");
  }

  return menuValue;
};

export default useMenuContext;
