describe("config.get()", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetModules();
  });
  it("should retrieve the correct value from env", async () => {
    process.env.NEXT_PUBLIC_CLIENT_APP_BASE_URL = "www.thenational.academy";
    const { default: config } = await import(".");

    const clientAppBaseUrl = config.get("clientAppBaseUrl");

    expect(clientAppBaseUrl).toBe("www.thenational.academy");
  });
  it("should return default value if present", async () => {
    process.env.NEXT_PUBLIC_CLIENT_APP_BASE_URL = undefined;
    const { default: config } = await import(".");

    expect(config.get("clientAppBaseUrl")).toEqual("http://localhost:3000");
  });
  it("should throw for non-existent name", async () => {
    const { default: config } = await import(".");

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    expect(() => config.get("nonExistentVarName")).toThrowError();
  });
});

export {};
