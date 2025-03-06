import { Sdk } from "../../sdk";

export const getUserQuery = (sdk: Sdk) => async (args: { userId: string }) => {
  const { userId } = args;
  const res = await sdk.getUser({
    userId,
  });
  return res;
};
