/* eslint-disable import/no-unresolved */
import { initializeApp, cert } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getDatabase } from "firebase-admin/database";
// import { getApps } from "firebase/app";

import { OakUser } from "../auth/useAuth";
import config from "../config";

import graphqlApi from "./graphql";
import serviceAccount from "./firebase-admin-service-account.json";

try {
  initializeApp({
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    credential: cert(serviceAccount),
    databaseURL: config.get("firebaseDatabaseUrl"),
  });
} catch (error) {
  /*
   * We skip the "already exists" message which is
   * not an actual error when we're hot-reloading.
   * @see https://rishi.app/blog/using-firebase-admin-with-next-js
   */
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  if (!/already exists/u.test(error.message)) {
    // @TODO bugsnag
  }
}

/**
 *
 * This function creates the user in Hasura, and adds hasura custom claims
 * to the JWT in firebase.
 */
export const confirmNewUser = async (accessToken: string): Promise<OakUser> => {
  try {
    const accessTokenData = await getAuth().verifyIdToken(accessToken);
    const { uid: firebase_id, email } = accessTokenData;

    if (!email) {
      throw new Error("No email in access token");
    }

    const { user: users } = await graphqlApi.getUsersByEmail({ email });

    if (users.length > 1) {
      // More than one user with this email, this is a problem
      // @TODO bugnsag
    }

    let [user] = users;

    if (!user) {
      // Create user in hasura
      const res = await graphqlApi.createUser({
        user: {
          firebase_id,
          email,
        },
      });

      if (!res.insert_user_one) {
        throw new Error("Invalid hasura response");
      }
      user = res.insert_user_one;
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
    await getAuth().setCustomUserClaims(firebase_id, customClaims);

    // Update real-time database to notify client to force refresh.
    const metadataRef = getDatabase().ref("metadata/" + firebase_id);

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
