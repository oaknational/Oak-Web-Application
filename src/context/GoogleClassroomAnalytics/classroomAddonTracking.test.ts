import {
  classroomAddOnOpenedTracked,
  clearClassroomAddOnOpened,
  markClassroomAddOnNavigation,
  trackClassroomAddOnOpenedOnce,
} from "./classroomAddonTracking";

describe("classroomAddonTracking", () => {
  beforeEach(() => {
    sessionStorage.clear();
  });

  it("tracks classroomAddOnOpened only once until cleared", () => {
    const onTrack = jest.fn();

    expect(trackClassroomAddOnOpenedOnce(onTrack)).toBe(true);
    expect(trackClassroomAddOnOpenedOnce(onTrack)).toBe(false);

    expect(onTrack).toHaveBeenCalledTimes(1);
    expect(classroomAddOnOpenedTracked()).toBe(true);
  });

  it("clears the tracking flag when the iframe closes", () => {
    trackClassroomAddOnOpenedOnce(jest.fn());

    clearClassroomAddOnOpened();

    expect(classroomAddOnOpenedTracked()).toBe(false);
  });

  it("preserves the tracking flag for the sign-in to lesson redirect", () => {
    trackClassroomAddOnOpenedOnce(jest.fn());
    markClassroomAddOnNavigation();

    clearClassroomAddOnOpened();
    expect(classroomAddOnOpenedTracked()).toBe(true);

    clearClassroomAddOnOpened();
    expect(classroomAddOnOpenedTracked()).toBe(false);
  });
});
