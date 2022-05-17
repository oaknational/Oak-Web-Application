import { FC } from "react";

import { authContext, OakAuth } from "../../context/Auth";

export const defaultMockedAuthProviderValue = {
  user: null,
  signOut: async () => undefined,
  signInWithEmail: async () => undefined,
  signInWithEmailCallback: async () => undefined,
};

export type MockedAuthProviderProps = {
  value?: Partial<OakAuth>;
};
export const loggedInAuthProviderProps: MockedAuthProviderProps = {
  value: {
    user: {
      id: "4395834",
      email: "2593485932@324359483u534.com",
    },
  },
};
const MockedAuthProvider: FC<MockedAuthProviderProps> = ({
  children,
  value,
}) => {
  return (
    <authContext.Provider
      value={{ ...defaultMockedAuthProviderValue, ...value }}
    >
      {children}
    </authContext.Provider>
  );
};

export default MockedAuthProvider;
