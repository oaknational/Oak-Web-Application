import { FC } from "react";

import { authContext, OakAuth } from "../../auth/useAuth";

export const defaultMockedAuthProviderValue = {
  user: null,
  isLoggedIn: false,
  signOut: async () => undefined,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  signInWithEmail: async (email: string) => undefined,
  signInWithEmailCallback: async () => undefined,
};

export type MockedAuthProviderProps = {
  value?: Partial<OakAuth>;
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
