import { z } from "zod";

import { OakUser } from "../../auth/useAuth";

type ApiAuthConfirmNewUserProps = {
  accessToken: string;
};

export const apiAuthConfirmNewUser = async ({
  accessToken,
}: ApiAuthConfirmNewUserProps): Promise<OakUser> => {
  const response = await fetch("/api/auth/confirm-new-user", {
    method: "POST",
    body: JSON.stringify({ accessToken }),
  });

  if (!response.ok) {
    const error = await response.json();

    throw new Error(error.message);
  }
  const oakUser: OakUser = await response.json();

  return z
    .object({
      id: z.number(),
      email: z.string(),
    })
    .parse(oakUser);
};
