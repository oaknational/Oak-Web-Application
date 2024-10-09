import { currentUser } from "@clerk/nextjs/server";

import { UseUserReturn } from "./mockClerk";

import { UserResource } from "clerk";

type CurrentUser = NonNullable<Awaited<ReturnType<typeof currentUser>>>;

/**
 * Mock client-side user object
 */
export const mockUser = {
  id: "user-123",
  publicMetadata: {},
  reload: jest.fn(),
  externalAccounts: [],
  emailAddresses: [
    { emailAddress: "test-email", verification: { status: "verified" } },
  ],
  createdAt: new Date("2024-10-07T15:00:00Z"),
  updatedAt: new Date("2024-10-08T16:00:00Z"),
  lastSignInAt: new Date("2024-10-07T15:00:00Z"),
  async update() {
    return this;
  },
} as unknown as UserResource;

export const mockUserWithDownloadAccess: UserResource = {
  ...mockUser,
  publicMetadata: {
    owa: {
      isRegionAuthorised: true,
      isOnboarded: true,
    },
  },
};

export const mockUserWithDownloadAccessNotOnboarded: UserResource = {
  ...mockUser,
  publicMetadata: {
    owa: {
      isRegionAuthorised: true,
      isOnboarded: false,
    },
  },
};

export const mockTeacherUserWithDownloadAccess: UserResource = {
  ...mockUser,
  publicMetadata: {
    owa: {
      isRegionAuthorised: true,
      isTeacher: true,
      isOnboarded: true,
    },
  },
};

export const mockUserWithoutDownloadAccess: UserResource = {
  ...mockUser,
  publicMetadata: {
    owa: {
      isRegionAuthorised: false,
    },
  },
};

/**
 * Mock return value for a logged in state
 *
 * Use with the `useUser` hook
 */
export const mockLoggedIn: UseUserReturn & { user: UserResource } = {
  user: mockUser,
  isLoaded: true,
  isSignedIn: true,
};

/**
 * Mock return value for a logged out state
 *
 * Use with the `useUser` hook
 */
export const mockLoggedOut: UseUserReturn = {
  user: null,
  isLoaded: true,
  isSignedIn: false,
};

/**
 * Mock return value for the user loading state
 *
 * Use with the `useUser` hook
 */
export const mockLoadingUser: UseUserReturn = {
  user: undefined,
  isLoaded: false,
  isSignedIn: undefined,
};

/**
 * Provides a mock return value for the backend `currentUser()`
 */
export const mockCurrentUser: CurrentUser = {
  id: "123",
  passwordEnabled: false,
  totpEnabled: false,
  backupCodeEnabled: false,
  twoFactorEnabled: false,
  banned: false,
  locked: false,
  createdAt: 0,
  updatedAt: 0,
  imageUrl: "",
  hasImage: false,
  primaryEmailAddressId: null,
  primaryPhoneNumberId: null,
  primaryWeb3WalletId: null,
  lastSignInAt: null,
  externalId: null,
  username: null,
  firstName: null,
  lastName: null,
  publicMetadata: {},
  privateMetadata: {},
  unsafeMetadata: {},
  emailAddresses: [],
  phoneNumbers: [],
  web3Wallets: [],
  externalAccounts: [],
  samlAccounts: [],
  lastActiveAt: null,
  createOrganizationEnabled: false,
  createOrganizationsLimit: null,
  primaryEmailAddress: null,
  primaryPhoneNumber: null,
  primaryWeb3Wallet: null,
  fullName: null,
  deleteSelfEnabled: false,
};
