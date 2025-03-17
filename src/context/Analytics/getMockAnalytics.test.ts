import { getMockAnalytics } from "./getMockAnalytics";

describe("getMockAnalytics", () => {
  it("should return an object with a track property", () => {
    const mockAnalytics = getMockAnalytics();
    expect(mockAnalytics).toHaveProperty("track");
  });

  it("should return an object with a posthogDistinctId property", () => {
    const mockAnalytics = getMockAnalytics();
    expect(mockAnalytics).toHaveProperty(
      "posthogDistinctId",
      "mock-distinct-id",
    );
  });

  it("should return an object with an identify method", () => {
    const mockAnalytics = getMockAnalytics();
    expect(mockAnalytics).toHaveProperty("identify");
    expect(typeof mockAnalytics.identify).toBe("function");
  });

  it("should call console.log when identify is called", () => {
    process.env.STORYBOOK = "1";
    const mockAnalytics = getMockAnalytics();
    console.log = jest.fn();

    // Assuming identify requires two arguments, e.g., userId and traits
    const userId = "user123";
    const traits = { email: "user@example.com" };

    mockAnalytics.identify(userId, traits);

    expect(console.log).toHaveBeenCalledWith("Mock identify called");
  });

  it("should call console.log when any track method is called", () => {
    process.env.STORYBOOK = "1";
    const mockAnalytics = getMockAnalytics();
    console.log = jest.fn();
    const trackMethods = Object.keys(mockAnalytics.track);

    trackMethods.forEach((method) => {
      // @ts-expect-error: track method might not exist on mockAnalytics.track
      mockAnalytics.track[method]();
      expect(console.log).toHaveBeenCalledWith(
        `Mock track called with event: ${method}`,
      );
    });
  });
});
