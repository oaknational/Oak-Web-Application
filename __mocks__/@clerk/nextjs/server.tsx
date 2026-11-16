const clerkMock = {
  __esModule: true,
  currentUser(): { publicMetadata?: unknown } | null {
    return null;
  },
  async auth() {
    const user = clerkMock.currentUser();
    return {
      isAuthenticated: !!user,
      sessionClaims: user?.publicMetadata ?? null,
    };
  },
  clerkClient() {
    return {
      users: {
        updateUserMetadata: () => {},
      },
    };
  },
  getAuth() {
    return {
      sessionClaims: null,
      sessionId: null,
      actor: null,
      userId: null,
      orgId: null,
      orgRole: null,
      orgSlug: null,
      orgPermissions: null,
      getToken: () => {},
      has: () => {},
    };
  },
};

module.exports = clerkMock;
