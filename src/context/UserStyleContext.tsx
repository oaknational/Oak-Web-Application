import { createContext, useContext, FC } from "react";

import useLocalStorage from "../hooks/useLocalStorage";

export const userTypes = ["pupils", "teachers"] as const;
type UserTypes = typeof userTypes;
export type UserType = UserTypes[number];

export interface UserContextInterface {
  user: UserType;
  setUser: (user: UserType) => void;
}

export const UserStyleContext = createContext<UserContextInterface | null>(
  null
);

export const UserStyleContextProvider: FC = ({ children }) => {
  const [user, setUser] = useLocalStorage<UserType>("userTheme", "pupils");

  return (
    <UserStyleContext.Provider value={{ user, setUser }}>
      {children}
    </UserStyleContext.Provider>
  );
};

export const useUserStyleContext = () => {
  const userStyleContext = useContext(UserStyleContext);
  if (!userStyleContext) {
    throw new Error(
      "useStyleContext() called outside of user style context provider"
    );
  }
  return userStyleContext;
};
