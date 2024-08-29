import { useUser } from "@clerk/nextjs";

import { mockLoggedOut } from "./mockUser";

import * as featureFlaggedClerk from "@/context/FeatureFlaggedClerk/FeatureFlaggedClerk";

export type UseUserReturn = ReturnType<typeof useUser>;

let useUserReturn = mockLoggedOut;
let spy: jest.SpyInstance | null = null;

export function enableMockClerk(
  clerkApi?: Partial<typeof featureFlaggedClerk.fakeClerkApi>,
) {
  if (!("_isMockFunction" in featureFlaggedClerk.useFeatureFlaggedClerk)) {
    throw new Error(
      `You must call
\`jest.mock("@/context/FeatureFlaggedClerk/FeatureFlaggedClerk");\`
in your test file to enable mocking of Clerk`,
    );
  }

  spy?.mockRestore();
  spy = jest
    .spyOn(featureFlaggedClerk, "useFeatureFlaggedClerk")
    .mockReturnValue({
      ...featureFlaggedClerk.fakeClerkApi,
      useUser() {
        return useUserReturn;
      },
      ...clerkApi,
    });
}

export function disableMockClerk() {
  spy?.mockRestore();
  spy = null;
}

export function setUseUserReturn(newUseUserReturn: UseUserReturn) {
  if (!spy) {
    enableMockClerk();
  }
  useUserReturn = newUseUserReturn;
}
