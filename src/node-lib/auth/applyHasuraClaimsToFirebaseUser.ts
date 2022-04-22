import { OakUser } from "../../auth/useAuth";
import { firebaseAdminAuth, firebaseAdminDatabase } from "../firebase";

export const createHasuraClaims = ({ user }: { user: OakUser }) => {
  return {
    "https://hasura.io/jwt/claims": {
      "x-hasura-default-role": "user",
      "x-hasura-allowed-roles": ["user"],
      // Hasura requires that we use type string
      "x-hasura-user-id": String(user.id),
    },
  };
};

const applyHasuraClaimsToFirebaseUser = async ({
  firebaseId,
  user,
}: {
  firebaseId: string;
  user: OakUser;
}) => {
  const customClaims = createHasuraClaims({ user });

  // Set custom user claims on this newly created user.
  await firebaseAdminAuth.setCustomUserClaims(firebaseId, customClaims);
  // Update real-time database to notify client to force refresh.
  const metadataRef = firebaseAdminDatabase.ref("metadata/" + firebaseId);
  // Set the refresh time to the current UTC timestamp.
  // This will be captured on the client to force a token refresh.
  await metadataRef.set({ refreshTime: new Date().getTime() });
};

export default applyHasuraClaimsToFirebaseUser;
