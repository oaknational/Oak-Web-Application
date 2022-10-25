const configGetSpy = jest.fn(() => "{}");
const initializeAppSpy = jest.fn();
const consoleWarnSpy = jest.spyOn(console, "warn");

describe("node-lib/firebase.ts", () => {
  beforeEach(() => {
    jest.resetModules();
    jest.restoreAllMocks();
    jest.mock("../config/secrets", () => ({
      get: configGetSpy,
    }));
    jest.mock("firebase-admin/app", () => ({
      cert: jest.fn(),
      getApp: jest.fn(),
      getApps: jest.fn(() => []),
      initializeApp: initializeAppSpy,
    }));
    jest.mock("firebase-admin/auth", () => ({
      getAuth: jest.fn(),
    }));
    jest.mock("firebase-admin/database", () => ({
      getDatabase: jest.fn(),
    }));
  });
  it("should get firebase serviceAccount", async () => {
    await import("./firebase");
    expect(configGetSpy).toHaveBeenCalledWith("firebaseServiceAccount");
  });
  it("should call initializeApp", async () => {
    await import("./firebase");
    expect(initializeAppSpy).toHaveBeenCalled();
  });
  it.skip("should console warn if fails to initialize", async () => {
    // @todo fix this test, not sure why spy not working
    jest.mock("firebase-admin/app", () => ({
      __esModule: true,
      cert: jest.fn(),
      getApp: jest.fn(),
      getApps: jest.fn(() => []),
      initializeApp: jest.fn(() => {
        throw new Error("");
      }),
    }));

    await import("./firebase");
    expect(consoleWarnSpy).toHaveBeenLastCalledWith("Firebase failed to init");
  });
  it.todo("should call error handler if fails to initialize");
});

// Must export to make a module, as no imports
export {};
