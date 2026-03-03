"use client";
import { createContext, FC, useState } from "react";

type SaveContext = {
  savedUnitsCount: number | null;
  setSavedUnitsCount: (count: number | null) => void;
  incrementSavedUnitsCount: () => void;
  decrementSavedUnitsCount: () => void;
};
export const saveCountContext = createContext<SaveContext | null>(null);

export const SaveCountProvider: FC<{
  children?: React.ReactNode;
}> = ({ children }) => {
  const [savedUnitsCount, setSavedUnitsCount] = useState<number | null>(null);

  const incrementSavedUnitsCount = () => {
    if (savedUnitsCount !== null) {
      setSavedUnitsCount((prevCount) => prevCount! + 1);
    }
  };
  const decrementSavedUnitsCount = () => {
    if (savedUnitsCount !== null) {
      setSavedUnitsCount((prevCount) => prevCount! - 1);
    }
  };

  return (
    <saveCountContext.Provider
      value={{
        savedUnitsCount,
        setSavedUnitsCount,
        incrementSavedUnitsCount,
        decrementSavedUnitsCount,
      }}
    >
      {children}
    </saveCountContext.Provider>
  );
};
