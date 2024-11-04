module.exports = {
  __esModule: true,
  currentUser() {
    return null;
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
