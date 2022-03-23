/* eslint-disable import/namespace */

import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

import hasura from "./hasura";

admin.initializeApp(functions.config().firebase);

// On sign up.
exports.processSignUp = functions.auth.user().onCreate(async (user) => {
  try {
    console.log(user);
    
    const { uid: firebase_id, email } = user;

    if (!email) {
      throw new Error("No email in onCreate hook");
    }
    // Create user in hasura
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

    await admin.auth().setCustomUserClaims(user.uid, customClaims);

    // Update real-time database to notify client to force refresh.
    const metadataRef = admin.database().ref("metadata/" + user.uid);
    // Set the refresh time to the current UTC timestamp.
    // This will be captured on the client to force a token refresh.
    await metadataRef.set({ refreshTime: new Date().getTime() });
  } catch (error) {
    // @TODO error service
    console.log(error);
  }
});
