import { Sdk } from "@/node-lib/personalisation-api/generated/sdk";

export const getUserQuery = (sdk: Sdk) => async (args: { userId: string }) => {
  const { userId } = args;
  const res = await sdk.getUser({ userId });
  return res;
};
