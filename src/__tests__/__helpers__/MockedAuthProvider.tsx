import { FC } from "react";

import { authContext, OakAuth } from "../../auth/useAuth";

export const defaultMockedAuthProviderValue = {
  user: null,
  signOut: async () => undefined,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  signInWithEmail: async (email: string) => undefined,
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
