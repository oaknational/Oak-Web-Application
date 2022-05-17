import { FirebaseError } from "firebase/app";

import { OakUser } from "../../context/Auth";
import OakError from "../../errors/OakError";
import { firebaseAdminAuth, firebaseAdminDatabase } from "../firebase";

export const createHasuraClaims = ({ user }: { user: OakUser }) => {
  return {
    "https://hasura.io/jwt/claims": {
      "x-hasura-default-role": "user",
      "x-hasura-allowed-roles": ["user"],
      // Hasura requires that we use type string
      "x-hasura-user-id": user.id,
    },
  };
};

const applyHasuraClaimsToFirebaseUser = async ({
  firebaseUid,
  user,
}: {
  firebaseUid: string;
  user: OakUser;
}) => {
  const customClaims = createHasuraClaims({ user });

  try {
    // Set custom user claims on this newly created user.
    await firebaseAdminAuth.setCustomUserClaims(firebaseUid, customClaims);
    // Update real-time database to notify client to force refresh.
    const metadataRef = firebaseAdminDatabase.ref("metadata/" + firebaseUid);
    // Set the refresh time to the current UTC timestamp.
    // This will be captured on the client to force a token refresh.
    await metadataRef.set({ refreshTime: new Date().getTime() });
  } catch (error) {
    if (error instanceof FirebaseError && error.code === "app/network-error") {
      throw new OakError({ code: "misc/network-error", originalError: error });
    }
    throw new OakError({ code: "misc/unknown", originalError: error });
  }
};

export default applyHasuraClaimsToFirebaseUser;
