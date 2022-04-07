import { OakUser } from "../auth/useAuth";

import { firebaseAdminAuth, firebaseAdminDatabase } from "./firebase";
import graphqlApi from "./graphql";

/**
 *
 * This function creates the user in Hasura, and adds hasura custom claims
 * to the JWT in firebase.
 */
export const login = async (accessToken: string): Promise<OakUser> => {
  try {
    const accessTokenData = await firebaseAdminAuth.verifyIdToken(accessToken);
    const { uid: firebaseId, email } = accessTokenData;

    if (!email) {
      throw new Error("No email in access token");
    }

    const getUserRes = await graphqlApi.getUser({ firebaseId, email });
    let user: OakUser | null = null;
    user = getUserRes?.user?.[0] || null;

    if (!user) {
      const upsertUserRes = await graphqlApi.upsertUser({
        user: {
          firebase_id: firebaseId,
          email,
        },
      });

      console.log(upsertUserRes);

      user = upsertUserRes.insert_user_one || null;
    }

    if (!user) {
      throw new Error("Invalid hasura response");
    }

    const customClaims = {
      "https://hasura.io/jwt/claims": {
        "x-hasura-default-role": "user",
        "x-hasura-allowed-roles": ["user"],
        // Hasura requires that we use type string
        "x-hasura-user-id": String(user.id),
      },
    };

    // Set custom user claims on this newly created user.
    await firebaseAdminAuth.setCustomUserClaims(firebaseId, customClaims);
    // Update real-time database to notify client to force refresh.
    const metadataRef = firebaseAdminDatabase.ref("metadata/" + firebaseId);
    // Set the refresh time to the current UTC timestamp.
    // This will be captured on the client to force a token refresh.
    await metadataRef.set({ refreshTime: new Date().getTime() });

    return user;
  } catch (error) {
    // @TODO error service
    console.log(error);
    throw new Error("Failed to confirm new user");
  }
};
