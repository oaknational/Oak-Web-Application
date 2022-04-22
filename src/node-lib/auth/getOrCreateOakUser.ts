import { OakUser } from "../../auth/useAuth";
import OakError from "../../errors/OakError";
import graphqlApi from "../graphql";

const getOrCreateOakUser = async ({
  firebaseId,
  email,
}: {
  firebaseId: string;
  email: string;
}) => {
  try {
    const getUserRes = await graphqlApi.getUser({ firebaseId, email });
    let user: OakUser | null = null;
    user = getUserRes?.user?.[0] || null;

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
          firebase_id: firebaseId,
          email,
        },
      });

      user = upsertUserRes.insert_user_one || null;
    }

    if (!user) {
      // Basically shouldn't happen
      throw new Error("Invalid hasura response");
    }

    return user;
  } catch (error) {
    /**
     * @todo catch and decode graphql/hasura errors
     */
    throw new OakError({ code: "misc/unknown" });
  }
};

export default getOrCreateOakUser;
