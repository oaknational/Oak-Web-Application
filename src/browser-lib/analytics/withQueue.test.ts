import {
  AnalyticsService,
  EventFn,
  IdentifyFn,
} from "../../context/Analytics/AnalyticsProvider";

import withQueue from "./withQueue";

const originalService: AnalyticsService<unknown> = {
  name: "posthog",
  init: jest.fn(),
  state: jest.fn(() => "pending"),
  track: jest.fn(),
  page: jest.fn(),
  identify: jest.fn(),
  alias: jest.fn(),
  optOut: jest.fn(),
  optIn: jest.fn(),
};

describe("withQueue", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  test("should add to queue not fire events if state: pending", () => {
    const service = withQueue(originalService);

    service.page({ path: "/bloo/blah?holy=moly" });
    service.identify("user-123", { email: "bar" });
    service.track("event-123", { foo: "bar" });

    expect(service.queue).toEqual([
      { type: "page", props: { path: "/bloo/blah?holy=moly" } },
      { type: "identify", userId: "user-123", props: { email: "bar" } },
      { type: "track", eventName: "event-123", props: { foo: "bar" } },
    ]);
    expect(originalService.page).not.toHaveBeenCalled();
    expect(originalService.identify).not.toHaveBeenCalled();
    expect(originalService.track).not.toHaveBeenCalled();
  });
  test("should clear queue without firing events if state -> disabled", async () => {
    // create a queue with a 10ms timer
    const service = withQueue(originalService, 10);

    service.page({ path: "/bloo/blah?holy=moly" });
    service.identify("user-123", { email: "bar" });
    service.track("event-123", { foo: "bar" });

    (originalService.state as jest.Mock).mockImplementation(() => "disabled");

    // wait 15ms so that queue can refresh
    await new Promise((r) => setTimeout(r, 15));

    expect(service.queue).toEqual([]);
    expect(originalService.page).not.toHaveBeenCalled();
    expect(originalService.identify).not.toHaveBeenCalled();
    expect(originalService.track).not.toHaveBeenCalled();
  });
  test("should fire events and clear queue if state -> enabled", async () => {
    // create a queue with a 10ms timer
    const service = withQueue(originalService, 10);

    const identifyArgs: Parameters<IdentifyFn> = ["user-123", { email: "bar" }];
    const trackArgs: Parameters<EventFn> = ["event-123", { foo: "bar" }];

    service.page({ path: "/bloo/blah?holy=moly" });
    service.identify(...identifyArgs);
    service.track(...trackArgs);

    (originalService.state as jest.Mock).mockImplementation(() => "enabled");

    // wait 15ms so that queue can refresh
    await new Promise((r) => setTimeout(r, 15));

    expect(service.queue).toEqual([]);
    expect(originalService.page).toHaveBeenCalled();
    expect(originalService.identify).toHaveBeenCalledWith(...identifyArgs);
    expect(originalService.track).toHaveBeenCalledWith(...trackArgs);
  });
});
