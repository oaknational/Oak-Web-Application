import { OakUser } from "../../auth/useAuth";
import OakError from "../../errors/OakError";
import graphqlApi from "../graphql";

const getOrCreateOakUser = async ({
  firebaseUid,
  email,
}: {
  firebaseUid: string;
  email: string;
}) => {
  try {
    const getUserRes = await graphqlApi.getUser({ firebaseUid, email });
    let user: OakUser | null = null;
    user = getUserRes?.users?.[0] || null;

    if (!user) {
      /**
       * If no user, attempt to create user.
       * We use an "upsert" mutation because if multiple Oak tabs are open and the user
       * signs up, each tab will call this function. If we use a "create" mutation, it
       * will fail on all but one of the tabs. Instead the "upsert" mutation will be a
       * noop if the user exists already.
       */
      const upsertUserRes = await graphqlApi.upsertUser({
        user: {
          firebaseUid,
          email,
        },
      });

      user = upsertUserRes.insert_users_one || null;
    }

    if (!user) {
      // Basically shouldn't happen
      throw new Error("Invalid hasura response");
    }

    return user;
  } catch (error) {
    console.log(error);

    /**
     * @todo catch and decode graphql/hasura errors
     */
    throw new OakError({ code: "misc/unknown" });
  }
};

export default getOrCreateOakUser;
