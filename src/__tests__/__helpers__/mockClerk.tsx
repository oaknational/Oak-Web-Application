import { vi } from "vitest";
import { useUser } from "@clerk/nextjs";
export type UseUserReturn = ReturnType<typeof useUser>;

export function setUseUserReturn(newUseUserReturn: UseUserReturn) {
  vi.mocked(useUser).mockReturnValue(newUseUserReturn);
}
