import getOrCreateOakUser from "./getOrCreateOakUser";

const testOakUser = {
  id: 1,
  firebaseUid: "123",
  email: "abc",
};
const testFirebaseUser = { uid: "123", email: "abc" };
const testParams = { firebaseUid: "123", email: "abc" };

const upsertUserSpy = jest.fn(async () => ({
  insert_users_one: testOakUser,
}));
const getUserSpy = jest.fn();
jest.mock("../graphql", () => ({
  upsertUser: (...args: []) => upsertUserSpy(...args),
  getUser: (...args: []) => getUserSpy(...args),
}));

describe("node-lib/auth/getOrCreateOakUser", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  it("should return the result oakUser if user found", async () => {
    getUserSpy.mockImplementationOnce(async () => ({ users: [testOakUser] }));
    const user = await getOrCreateOakUser(testParams);
    expect(user).toBe(testOakUser);
  });

  it("should not call upsertUser if user found", async () => {
    getUserSpy.mockImplementationOnce(async () => ({ users: [testOakUser] }));
    await getOrCreateOakUser(testParams);
    expect(upsertUserSpy).not.toHaveBeenCalled();
  });

  it("should return the result oakUser if user not found", async () => {
    getUserSpy.mockImplementationOnce(async () => ({ users: [] }));
    const user = await getOrCreateOakUser(testParams);
    expect(user).toBe(testOakUser);
  });

  it("should call upsertUser if user not found", async () => {
    getUserSpy.mockImplementationOnce(async () => ({ users: [] }));
    await getOrCreateOakUser(testParams);
    expect(upsertUserSpy).toHaveBeenCalledWith({
      user: {
        firebaseUid: testFirebaseUser.uid,
        email: testFirebaseUser.email,
      },
    });
  });

  it.todo("should throw OakError if upsertUser fails");
});
