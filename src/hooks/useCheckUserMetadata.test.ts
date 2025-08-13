import fetchMock from "jest-fetch-mock";

import { useCheckUserMetadata } from "@/hooks/useCheckUserMetadata";
import { setUseUserReturn } from "@/__tests__/__helpers__/mockClerk";
import {
  mockLoggedOut,
  mockLoggedIn,
  mockUser,
} from "@/__tests__/__helpers__/mockUser";

describe("useCheckUserMetadata", () => {
  beforeAll(() => {
    fetchMock.enableMocks();
  });

  afterAll(() => {
    fetchMock.disableMocks();
  });

  test("should not call API if user is not signed in", () => {
    setUseUserReturn(mockLoggedOut);

    useCheckUserMetadata();

    expect(fetchMock).not.toHaveBeenCalled();
  });

  test("should not call API if user does not have requiresGeoLocation", () => {
    setUseUserReturn(mockLoggedIn);

    useCheckUserMetadata();

    expect(fetchMock).not.toHaveBeenCalled();
  });

  test("should not call API if user has requiresGeoLocation set to false", () => {
    setUseUserReturn({
      ...mockLoggedIn,
      user: {
        ...mockUser,
        unsafeMetadata: { requiresGeoLocation: false },
      },
    });

    useCheckUserMetadata();

    expect(fetchMock).not.toHaveBeenCalled();
  });

  test("should call API if user has requiresGeoLocation set to true", () => {
    setUseUserReturn({
      ...mockLoggedIn,
      user: {
        ...mockUser,
        unsafeMetadata: { requiresGeoLocation: true },
      },
    });

    useCheckUserMetadata();

    expect(fetchMock).toHaveBeenCalledWith("/api/onboarding", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });
  });
});
