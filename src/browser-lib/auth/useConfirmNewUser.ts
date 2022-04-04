import { useCallback } from "react";

import useAccessToken from "../../auth/useAccessToken";
import { OakUser } from "../../auth/useAuth";
import api from "../api";

const useConfirmNewUser = () => {
  const [tokenFromState] = useAccessToken();

  const confirmNewUser = useCallback(
    async (tokenOverride?: string): Promise<OakUser> => {
      const accessToken = tokenOverride || tokenFromState;
      if (!accessToken) {
        throw new Error("Cannot call confirmNewUser without accessToken");
      }
      try {
        const user = await api.post["/auth/confirm-new-user"]({
          accessToken,
        });
        return user;
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
