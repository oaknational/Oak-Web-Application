describe("getBrowserConfig()", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetModules();
  });
  it("should retrieve the correct value from env", async () => {
    process.env.NEXT_PUBLIC_CLIENT_APP_BASE_URL = "www.thenational.academy";
    const { default: getBrowserConfig } = await import(
      "../browser-lib/getBrowserConfig"
    );

    const clientAppBaseUrl = getBrowserConfig("clientAppBaseUrl");

    expect(clientAppBaseUrl).toBe("www.thenational.academy");
  });
  it("should return default value if present", async () => {
    process.env.NEXT_PUBLIC_CLIENT_APP_BASE_URL = undefined;
    const { default: getBrowserConfig } = await import(
      "../browser-lib/getBrowserConfig"
    );

    expect(getBrowserConfig("clientAppBaseUrl")).toEqual(
      "http://localhost:3000"
    );
  });
  it("should return the default value for required values set to empty strings", async () => {
    process.env.NEXT_PUBLIC_CLIENT_APP_BASE_URL = "";
    const { default: getBrowserConfig } = await import(
      "../browser-lib/getBrowserConfig"
    );

    expect(getBrowserConfig("clientAppBaseUrl")).toEqual(
      "http://localhost:3000"
    );
  });
  it("should allow parsing numeric env vars", async () => {
    process.env.SANITY_REVALIDATE_SECONDS = "123";
    const { default: getBrowserConfig } = await import(
      "../browser-lib/getBrowserConfig"
    );

    expect(getBrowserConfig("sanityRevalidateSeconds")).toEqual(123);
  });
  it("should throw for non-existent name", async () => {
    const { default: getBrowserConfig } = await import(
      "../browser-lib/getBrowserConfig"
    );

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    expect(() => getBrowserConfig("nonExistentVarName")).toThrowError();
  });
  it("should throw on import if value not allowed", async () => {
    process.env.NEXT_PUBLIC_AXE_A11Y_LOGGING =
      "flagrant disregard for the constitution";
    try {
      await import("../browser-lib/getBrowserConfig");
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      expect(error.message).toContain("Allowed values: on, off");
    }
  });
});

export {};
