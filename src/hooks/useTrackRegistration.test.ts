import { renderHook } from "@testing-library/react";

import {
  resetUseTrackingRegistration,
  useTrackRegistration,
} from "./useTrackRegistration";

import { setUseUserReturn } from "@/__tests__/__helpers__/mockClerk";
import {
  mockLoggedIn,
  mockLoggedOut,
  mockUser,
} from "@/__tests__/__helpers__/mockUser";
import { getMockAnalytics } from "@/context/Analytics/getMockAnalytics";
import { UserResource } from "clerk";
import { SingleSignOnServiceValueType } from "@/browser-lib/avo/Avo";

const mockAnalytics = getMockAnalytics();

jest.mock("@/context/Analytics/useAnalytics", () => {
  return {
    __esModule: true,
    default: () => mockAnalytics,
  };
});

type ExternalAccountResource = UserResource["externalAccounts"][0];

const lastSignInDate = new Date(2024, 10, 9);
const mockNewUser: UserResource = {
  ...mockUser,
  lastSignInAt: lastSignInDate,
  unsafeMetadata: {
    owa: {
      lastTrackedSignInAt: null,
    },
  },
};
const mockExistingUser: UserResource = {
  ...mockUser,
  lastSignInAt: lastSignInDate,
  unsafeMetadata: {
    owa: {
      lastTrackedSignInAt: lastSignInDate.valueOf(),
    },
  },
};

describe(useTrackRegistration, () => {
  beforeEach(() => {
    resetUseTrackingRegistration();
    jest
      .spyOn(mockAnalytics.track, "userSignUpCompleted")
      .mockReset()
      .mockReturnValue(undefined);

    jest
      .spyOn(mockAnalytics.track, "userSignIn")
      .mockReset()
      .mockReturnValue(undefined);
  });

  describe("when the user has just signed up", () => {
    beforeEach(() => {
      setUseUserReturn({
        ...mockLoggedIn,
        user: mockNewUser,
      });
    });

    it("tracks the sign-up", () => {
      renderHook(useTrackRegistration);

      expect(mockAnalytics.track.userSignUpCompleted).toHaveBeenCalledWith(
        expect.objectContaining({
          userId_: "user-123",
          singleSignOnService: "Email",
        }),
      );
    });

    it("does not track a sign-in", () => {
      renderHook(useTrackRegistration);

      expect(mockAnalytics.track.userSignIn).not.toHaveBeenCalled();
    });

    it("updates the lastTrackedSignInAt date", () => {
      jest.spyOn(mockNewUser, "update");

      renderHook(useTrackRegistration);

      expect(mockNewUser.update).toHaveBeenCalledWith({
        unsafeMetadata: {
          owa: {
            lastTrackedSignInAt: lastSignInDate.valueOf(),
          },
        },
      });
    });

    it("only tracks the sign-up once", () => {
      renderHook(useTrackRegistration);
      renderHook(useTrackRegistration);

      expect(mockAnalytics.track.userSignUpCompleted).toHaveBeenCalledTimes(1);
    });

    it.each<
      [ExternalAccountResource["provider"], SingleSignOnServiceValueType]
    >([
      ["google", "Google"],
      ["microsoft", "Microsoft"],
    ])("tracks the provider %p as %p", (provider, singleSignOnService) => {
      setUseUserReturn({
        ...mockLoggedIn,
        user: {
          ...mockNewUser,
          externalAccounts: [
            {
              provider,
            } as ExternalAccountResource,
          ],
        },
      });

      renderHook(useTrackRegistration);

      expect(mockAnalytics.track.userSignUpCompleted).toHaveBeenCalledWith(
        expect.objectContaining({
          singleSignOnService,
        }),
      );
    });
  });

  describe.each<[description: string, user: UserResource]>([
    [
      "when the user has signed in before",
      { ...mockExistingUser, lastSignInAt: new Date(2024, 10, 8) },
    ],
    [
      "when the user did not sign-up through OWA",
      {
        ...mockUser,
        unsafeMetadata: {},
      },
    ],
  ])("%s", (_, user) => {
    beforeEach(() => {
      setUseUserReturn({
        ...mockLoggedIn,
        user,
      });
    });

    it("tracks the sign-in", () => {
      renderHook(useTrackRegistration);

      expect(mockAnalytics.track.userSignIn).toHaveBeenCalledWith({
        userId_: "user-123",
      });
    });

    it("only tracks the sign-in once", () => {
      renderHook(useTrackRegistration);
      renderHook(useTrackRegistration);

      expect(mockAnalytics.track.userSignIn).toHaveBeenCalledTimes(1);
    });

    it("does not track a sign-up", () => {
      renderHook(useTrackRegistration);

      expect(mockAnalytics.track.userSignUpCompleted).not.toHaveBeenCalled();
    });
  });

  it("does not track when lastTrackedSignInAt = lastSignInAt", () => {
    setUseUserReturn({
      ...mockLoggedIn,
      user: {
        ...mockExistingUser,
        unsafeMetadata: {
          owa: {
            lastTrackedSignInAt: lastSignInDate.valueOf(),
          },
        },
      },
    });

    renderHook(useTrackRegistration);

    expect(mockAnalytics.track.userSignIn).not.toHaveBeenCalled();
    expect(mockAnalytics.track.userSignUpCompleted).not.toHaveBeenCalled();
  });

  it("tracks when the user signs out", () => {
    jest
      .spyOn(mockAnalytics.track, "userSignOut")
      .mockReset()
      .mockReturnValue(undefined);

    setUseUserReturn({ ...mockLoggedIn, user: mockExistingUser });

    const { rerender } = renderHook(useTrackRegistration);

    expect(mockAnalytics.track.userSignOut).not.toHaveBeenCalled();

    setUseUserReturn(mockLoggedOut);

    rerender();

    expect(mockAnalytics.track.userSignOut).toHaveBeenCalled();
  });
});
