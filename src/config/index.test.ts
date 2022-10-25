describe("config.get()", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetModules();
  });
  it("should retrieve the correct value from env", async () => {
    process.env.NEXT_PUBLIC_CLIENT_APP_BASE_URL = "www.thenational.academy";
    const { default: config } = await import("./browser");

    const clientAppBaseUrl = config.get("clientAppBaseUrl");

    expect(clientAppBaseUrl).toBe("www.thenational.academy");
  });
  it("should return default value if present", async () => {
    process.env.NEXT_PUBLIC_CLIENT_APP_BASE_URL = undefined;
    const { default: config } = await import("./browser");

    expect(config.get("clientAppBaseUrl")).toEqual("http://localhost:3000");
  });
  it("should allow parsing numeric env vars", async () => {
    process.env.SANITY_REVALIDATE_SECONDS = "123";
    const { default: config } = await import("./browser");

    expect(config.get("sanityRevalidateSeconds")).toEqual(123);
  });
  it("should allow parsing of 'on' switches to boolean true", async () => {
    process.env.DISABLE_ISR = "on";
    const { default: config } = await import("./server");

    expect(config.get("disableIsr")).toEqual(true);
  });
  it("should allow parsing of 'on' switches with non-'on' to boolean false", async () => {
    process.env.DISABLE_ISR = "anything_but_on";
    const { default: config } = await import("./server");

    expect(config.get("disableIsr")).toEqual(false);
  });
  it("should throw for non-existent name", async () => {
    const { default: config } = await import("./browser");

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    expect(() => config.get("nonExistentVarName")).toThrowError();
  });
  it("should throw on import if value not allowed", async () => {
    process.env.NEXT_PUBLIC_AXE_A11Y_LOGGING =
      "flagrant disregard for the constitution";
    try {
      await import("./browser");
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      expect(error.message).toContain("Allowed values: on, off");
    }
  });
});

export {};
