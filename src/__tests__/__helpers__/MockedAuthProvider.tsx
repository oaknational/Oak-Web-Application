import { FC } from "react";

import { authContext } from "../../auth/useAuth";

export const defaultMockedAuthProviderValue = {
  user: null,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  signOut: async () => {},
  // eslint-disable-next-line @typescript-eslint/no-empty-function,@typescript-eslint/no-unused-vars
  signInWithEmail: async (email: string) => {},
  signInWithEmailCallback: async () => ({
    id: 1,
    email: "test@thenational.academy",
  }),
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
