/* eslint-disable import/no-unresolved */
import { config, auth } from "firebase-functions";
import { initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getDatabase } from "firebase-admin/database";

import hasura from "./hasura";

initializeApp(config().firebase);

// On sign up.
exports.processSignUp = auth.user().onCreate(async (user) => {
  try {
    const { uid: firebase_id, email } = user;

    if (!email) {
      throw new Error("No email in onCreate hook");
    }

    // Create user in hasura.
    const res = await hasura.CreateUser({
      user: {
        firebase_id,
        email,
      },
    });

    const oakUserId = res.insert_user_one?.id;

    if (!oakUserId) {
      throw new Error("No user.id in hasura sign up response");
    }

    const customClaims = {
      "https://hasura.io/jwt/claims": {
        "x-hasura-default-role": "user",
        "x-hasura-allowed-roles": ["user"],
        "x-hasura-user-id": oakUserId,
      },
    };

    // Set custom user claims on this newly created user.
    await getAuth().setCustomUserClaims(user.uid, customClaims);

    // Update real-time database to notify client to force refresh.
    const metadataRef = getDatabase().ref("metadata/" + user.uid);

    // Set the refresh time to the current UTC timestamp.
    // This will be captured on the client to force a token refresh.
    await metadataRef.set({ refreshTime: new Date().getTime() });
  } catch (error) {
    // @TODO error service
    console.log(error);
  }
});
