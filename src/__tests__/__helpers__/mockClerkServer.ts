import * as clerk from "@clerk/nextjs/server";
export type CurrentUser = NonNullable<
  Awaited<ReturnType<typeof clerk.currentUser>>
>;

/**
 * Sets the return value of `currentUser()` on the server
 */
export function setCurrentUser(user: CurrentUser | null) {
  jest.spyOn(clerk, "currentUser").mockResolvedValue(user);
}

/**
 * Installs a partial mock of `clerkClient()` for use on the server
 * to make requests to Clerk's API
 */
export function installMockClerkClient() {
  const mockClerkClient = {
    users: {
      updateUserMetadata: () => Promise.resolve(mockCurrentUser),
    },
  } as unknown as ReturnType<typeof clerk.clerkClient>;
  jest.spyOn(clerk, "clerkClient").mockReturnValue(mockClerkClient);
  return mockClerkClient;
}

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

export const mockCurrentUserWithNoEmailAddresses: CurrentUser = {
  ...mockCurrentUser,
  emailAddresses: [],
  primaryEmailAddress: null,
  primaryPhoneNumber: null,
  primaryWeb3Wallet: null,
  fullName: null,
};
