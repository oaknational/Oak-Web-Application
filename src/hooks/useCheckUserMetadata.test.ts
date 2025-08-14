import { useCheckUserMetadata } from "@/hooks/useCheckUserMetadata";
import { setUseUserReturn } from "@/__tests__/__helpers__/mockClerk";
import {
  mockLoggedOut,
  mockLoggedIn,
  mockUser,
} from "@/__tests__/__helpers__/mockUser";

const mockUseSWR = jest.fn();
jest.mock("swr", () => ({
  __esModule: true,
  default: (...args: []) => mockUseSWR(...args),
}));

describe("useCheckUserMetadata", () => {
  test("should not call API if user is not signed in", () => {
    setUseUserReturn(mockLoggedOut);

    useCheckUserMetadata();

    expect(mockUseSWR).toHaveBeenCalledWith(null, expect.any(Function));
  });

  test("should not call API if user does not have requiresGeoLocation", () => {
    setUseUserReturn(mockLoggedIn);

    useCheckUserMetadata();

    expect(mockUseSWR).toHaveBeenCalledWith(null, expect.any(Function));
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

    expect(mockUseSWR).toHaveBeenCalledWith(null, expect.any(Function));
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

    expect(mockUseSWR).toHaveBeenCalledWith(
      "/api/update-region",
      expect.any(Function),
    );
  });
});
