import * as clerk from "@clerk/nextjs/server";
export type User = NonNullable<Awaited<ReturnType<typeof clerk.currentUser>>>;
export type AuthObject = ReturnType<typeof clerk.getAuth>;

/**
 * Sets the return value of `currentUser()` on the server
 */
export function setCurrentUser(user: User | null) {
  jest.spyOn(clerk, "currentUser").mockResolvedValue(user);
}

/**
 * Sets the return value of `getAuth()` on the server
 */
export function setGetAuth(auth: AuthObject) {
  jest.spyOn(clerk, "getAuth").mockReturnValue(auth);
}

/**
 * Installs a partial mock of `clerkClient()` for use on the server
 * to make requests to Clerk's API
 */
export function installMockClerkClient() {
  const mockClerkClient = {
    users: {
      updateUserMetadata: () => Promise.resolve(mockServerUser),
      getUser: () => Promise.resolve(mockServerUser),
    },
  } as unknown as ReturnType<typeof clerk.clerkClient>;
  jest.spyOn(clerk, "clerkClient").mockReturnValue(mockClerkClient);
  return mockClerkClient;
}

/**
 * Provides a mock server user
 */
export const mockServerUser: User = {
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
  emailAddresses: [
    {
      emailAddress: "test@email.com",
      id: "1234",
      verification: null,
      linkedTo: [],
    },
  ],
  phoneNumbers: [],
  web3Wallets: [],
  externalAccounts: [],
  samlAccounts: [],
  lastActiveAt: null,
  createOrganizationEnabled: false,
  createOrganizationsLimit: null,
  primaryEmailAddress: {
    emailAddress: "test@email.com",
    id: "1234",
    verification: null,
    linkedTo: [],
  },
  primaryPhoneNumber: null,
  primaryWeb3Wallet: null,
  fullName: null,
  deleteSelfEnabled: false,
} as const;

/**
 * Provides a mock server user with no email addresses
 */
export const mockServerUserWithNoEmailAddresses: User = {
  ...mockServerUser,
  emailAddresses: [],
  primaryEmailAddress: null,
  primaryPhoneNumber: null,
  primaryWeb3Wallet: null,
  fullName: null,
};

/**
 * Signed in state for `getAuth()`
 */
export const mockGetAuthSignedIn: AuthObject = {
  sessionClaims: {
    __raw: "",
    iss: "issuer",
    sub: "123",
    sid: "session-id",
    nbf: 0,
    exp: 0,
    iat: 0,
  },
  sessionId: "session-id",
  actor: undefined,
  userId: "123",
  orgId: undefined,
  orgRole: undefined,
  orgSlug: undefined,
  orgPermissions: undefined,
  getToken: async () => "token",
  has: () => false,
  __experimental_factorVerificationAge: null,
  debug: () => ({}),
};

/**
 * Signed out state for `getAuth()`
 */
export const mockGetAuthSignedOut: AuthObject = {
  sessionClaims: null,
  sessionId: null,
  actor: null,
  userId: null,
  orgId: null,
  orgRole: null,
  orgSlug: null,
  orgPermissions: null,
  getToken: async () => null,
  has: () => false,
  __experimental_factorVerificationAge: null,
  debug: () => ({}),
};
