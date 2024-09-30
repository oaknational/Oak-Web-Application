import { getMockAnalytics } from "./getMockAnalytics";
import { AnalyticsContext } from "./AnalyticsProvider";

describe("getMockAnalytics", () => {
  let mockAnalytics: AnalyticsContext;

  beforeEach(() => {
    mockAnalytics = getMockAnalytics();
  });

  it("should return an object with a track property", () => {
    expect(mockAnalytics).toHaveProperty("track");
  });

  it("should return an object with a posthogDistinctId property", () => {
    expect(mockAnalytics).toHaveProperty(
      "posthogDistinctId",
      "mock-distinct-id",
    );
  });

  it("should return an object with an identify method", () => {
    expect(mockAnalytics).toHaveProperty("identify");
    expect(typeof mockAnalytics.identify).toBe("function");
  });

  it("should call console.log when identify is called", () => {
    const consoleSpy = jest.spyOn(console, "log");
    mockAnalytics.identify();
    expect(consoleSpy).toHaveBeenCalledWith("Mock identify called");
    consoleSpy.mockRestore();
  });

  it("should call console.log when any track method is called", () => {
    const consoleSpy = jest.spyOn(console, "log");
    const trackMethods = Object.keys(mockAnalytics.track);

    trackMethods.forEach((method) => {
      // @ts-expect-error: track method might not exist on mockAnalytics.track
      mockAnalytics.track[method]();
      expect(consoleSpy).toHaveBeenCalledWith(
        `Mock track called with event: ${method}`,
      );
    });

    consoleSpy.mockRestore();
  });
});
