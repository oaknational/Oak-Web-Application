import clerk, { useUser } from "@clerk/nextjs";
export type UseUserReturn = ReturnType<typeof useUser>;

export function setUseUserReturn(newUseUserReturn: UseUserReturn) {
  jest.spyOn(clerk, "useUser").mockReturnValue(newUseUserReturn);
}
