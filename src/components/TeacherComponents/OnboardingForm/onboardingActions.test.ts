import fetchMock from "jest-fetch-mock";

import { onboardUser } from "./onboardingActions";

import OakError from "@/errors/OakError";

describe(onboardUser, () => {
  beforeAll(() => {
    fetchMock.enableMocks();
    fetchMock.doMock(
      JSON.stringify({ owa: { isOnboarded: true, isTeacher: true } }),
    );
  });

  afterAll(() => {
    fetchMock.disableMocks();
  });

  it("makes a request to mark the user as onboarded", async () => {
    await onboardUser({ isTeacher: true });

    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringMatching("/api/auth/onboarding"),
      expect.objectContaining({
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isTeacher: true }),
      }),
    );
  });

  describe("when successful", () => {
    it("returns the response JSON", async () => {
      await expect(onboardUser({ isTeacher: true })).resolves.toEqual({
        owa: {
          isOnboarded: true,
          isTeacher: true,
        },
      });
    });
  });

  describe("when there is an error response", () => {
    it("throws", async () => {
      fetchMock.doMock(async () => {
        return {
          status: 500,
          body: "Internal Server error",
        };
      });

      await expect(onboardUser({ isTeacher: true })).rejects.toEqual(
        expect.any(OakError),
      );
    });
  });
});
