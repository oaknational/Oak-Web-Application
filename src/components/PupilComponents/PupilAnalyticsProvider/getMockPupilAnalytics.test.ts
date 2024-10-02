import { getMockPupilAnalytics } from "./getMockPupilAnalytics";
import { trackingEvents } from "./PupilAnalyticsProvider";

describe("getMockPupilAnalytics", () => {
  it("should return an object with a track method for each tracking event", () => {
    const mockAnalytics = getMockPupilAnalytics();

    trackingEvents.forEach((event) => {
      expect(typeof mockAnalytics.track[event]).toBe("function");
    });
  });
});
