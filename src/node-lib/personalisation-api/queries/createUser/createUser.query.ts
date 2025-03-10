import { Sdk } from "@/node-lib/personalisation-api/generated/sdk";

export const createUserQuery =
  (sdk: Sdk) => async (args: { userId: string }) => {
    const { userId } = args;
    const res = await sdk.createUser({ userId });
    return res;
  };
