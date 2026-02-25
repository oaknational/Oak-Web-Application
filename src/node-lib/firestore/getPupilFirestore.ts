import { ExternalAccountClient } from "google-auth-library";
import { Firestore } from "@google-cloud/firestore";

import { getGcpOidc } from "@/node-lib/oidc/getGcpOidc";

const getEmulatorFirestore = () => {
  // JDK is required for the emulator to run https://www.oracle.com/java/technologies/downloads
  const host = process.env.NEXT_PUBLIC_FIRESTORE_EMULATOR_HOST;
  if (!host) {
    throw new Error(
      "NEXT_PUBLIC_FIRESTORE_EMULATOR_HOST is required for emulator",
    );
  }
  const [hostname, port] = host.split(":");
  return new Firestore({
    projectId: "test-project-id", // Placeholder project ID for emulator
    host: hostname,
    port: Number.parseInt(port ?? "8089", 10),
    ssl: false,
    // Use (default) database in emulator — named databases export bug with Firestore:
    // See issue: https://github.com/firebase/firebase-tools/issues/9665
  });
};

export const getPupilFirestore = () => {
  if (process.env.NEXT_PUBLIC_USE_FIRESTORE_EMULATOR === "true")
    return getEmulatorFirestore();

  const GCP_PROJECT_ID = process.env.GCP_PROJECT_ID;
  const PUPIL_FIRESTORE_ID = process.env.PUPIL_FIRESTORE_ID;

  if (!GCP_PROJECT_ID || !PUPIL_FIRESTORE_ID) {
    throw new Error(
      "GCP_PROJECT_ID, PUPIL_FIRESTORE_ID are required environment variables.",
    );
  }

  const externalAccountJson = getGcpOidc([
    "https://www.googleapis.com/auth/datastore",
  ]);

  const authClient = ExternalAccountClient.fromJSON(externalAccountJson);

  return new Firestore({
    authClient,
    projectId: GCP_PROJECT_ID,
    databaseId: PUPIL_FIRESTORE_ID,
    ignoreUndefinedProperties: true,
  });
};
