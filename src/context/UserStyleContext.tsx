import { createContext, FC, useState } from "react";

type userType = "teacher" | "pupil";

export interface UserContextInterface {
  user: userType;
  setUser: (user: userType) => void;
}

export const UserStyleContext = createContext<UserContextInterface>(
  {} as UserContextInterface
);

export const UserStyleContextProvider: FC = (props) => {
  const [user, setUser] = useState<userType>("teacher");

  return (
    <UserStyleContext.Provider value={{ user, setUser }}>
      {props.children}
    </UserStyleContext.Provider>
  );
};
