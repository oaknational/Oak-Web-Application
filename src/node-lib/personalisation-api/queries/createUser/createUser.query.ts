import { Sdk } from "../../sdk";

export const createUserQuery =
  (sdk: Sdk) => async (args: { userId: string }) => {
    const { userId } = args;
    const res = await sdk.createUser({
      id: userId,
    });
    return res;
  };
