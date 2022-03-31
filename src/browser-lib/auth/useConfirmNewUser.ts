import ky from "ky-universal";
import { useCallback } from "react";
import z from "zod";

import useAccessToken from "../../auth/useAccessToken";
import { OakUser } from "../../auth/useAuth";

const useConfirmNewUser = () => {
  const tokenFromState = useAccessToken();

  const confirmNewUser = useCallback(
    async (tokenOverride?: string): Promise<OakUser> => {
      try {
        const user = await ky
          .post("/api/auth/confirm-new-user", {
            json: { accessToken: tokenOverride || tokenFromState },
          })
          .json();

        return z
          .object({
            id: z.number(),
            email: z.string(),
          })
          .parse(user);
      } catch (error) {
        console.log(error);
        console.log("error in confirm new user, see above ");

        throw new Error("confirm new user failed");
      }
    },
    [tokenFromState]
  );

  return confirmNewUser;
};

export default useConfirmNewUser;
