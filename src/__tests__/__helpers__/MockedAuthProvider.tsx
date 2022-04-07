import { FC } from "react";

import { authContext } from "../../auth/useAuth";

export const defaultMockedAuthProviderValue = {
  user: null,
  signOut: async () => undefined,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  signInWithEmail: async (email: string) => undefined,
  signInWithEmailCallback: async () => undefined,
};

type MockedAuthProviderProps = {
  value?: Partial<typeof defaultMockedAuthProviderValue>;
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
