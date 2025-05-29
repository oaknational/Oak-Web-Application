import { useContext } from "react";

import { saveCountContext } from "./SaveCountProvider";

const useSaveCountContext = () => {
  const saveValue = useContext(saveCountContext);

  if (!saveValue) {
    throw new Error("useSaveContext() called outside of save provider");
  }
  return saveValue;
};

export default useSaveCountContext;
