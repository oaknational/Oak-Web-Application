import { UseUserReturn } from "./mockClerk";

import { UserResource } from "clerk";

/**
 * Mock client-side user object
 */
export const mockUser = {
  id: "user-123",
  publicMetadata: { owa: { isOnboarded: true } },
  unsafeMetadata: {},
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

export const mockOnboardedUser: UserResource = {
  ...mockUser,
  publicMetadata: {
    owa: {
      isOnboarded: true,
    },
  },
};

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

export const mockUserWithoutDownloadAccessNotOnboarded: UserResource = {
  ...mockUser,
  publicMetadata: {
    owa: {
      isRegionAuthorised: false,
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
      isOnboarded: true,
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

export const mockNotOnboardedUser: UseUserReturn & { user: UserResource } = {
  user: mockUserWithDownloadAccessNotOnboarded,
  isLoaded: true,
  isSignedIn: true,
};

export const mockGeorestrictedUser: UseUserReturn & { user: UserResource } = {
  user: mockUserWithoutDownloadAccess,
  isLoaded: true,
  isSignedIn: true,
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
