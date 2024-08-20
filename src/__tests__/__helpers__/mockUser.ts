import { useUser } from "@clerk/nextjs";

type UseUserReturn = ReturnType<typeof useUser>;
type UserResource = NonNullable<UseUserReturn["user"]>;

export const mockUser = {
  id: "user-123",
  publicMetadata: {},
  reload: jest.fn(),
} as unknown as UserResource;

export const mockLoggedIn: UseUserReturn & { user: UserResource } = {
  user: mockUser,
  isLoaded: true,
  isSignedIn: true,
};

export const mockLoggedOut: UseUserReturn = {
  user: null,
  isLoaded: true,
  isSignedIn: false,
};

export const mockLoadingUser: UseUserReturn = {
  user: undefined,
  isLoaded: false,
  isSignedIn: undefined,
};
