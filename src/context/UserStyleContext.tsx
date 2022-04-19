import { createContext, FC } from "react";

import useLocalStorage from "../hooks/useLocalStorage";

type UserType = "teachers" | "pupils";

export interface UserContextInterface {
  user: UserType;
  setUser: (user: UserType) => void;
}

export const UserStyleContext = createContext<UserContextInterface>(
  {} as UserContextInterface
);

export const UserStyleContextProvider: FC = (props) => {
  const [user, setUser] = useLocalStorage<UserType>("userTheme", "pupils");

  return (
    <UserStyleContext.Provider value={{ user, setUser }}>
      {props.children}
    </UserStyleContext.Provider>
  );
};
