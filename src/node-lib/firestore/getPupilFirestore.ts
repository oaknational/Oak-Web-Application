import { getVercelOidcToken } from "@vercel/functions/oidc";
import { ExternalAccountClient } from "google-auth-library";
import { Firestore } from "@google-cloud/firestore";

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
    port: parseInt(port ?? "8089", 10),
    ssl: false,
    databaseId: process.env.PUPIL_FIRESTORE_ID,
  });
};

export const getPupilFirestore = () => {
  if (process.env.NEXT_PUBLIC_USE_FIRESTORE_EMULATOR === "true")
    return getEmulatorFirestore();

  const GCP_PROJECT_ID = process.env.GCP_PROJECT_ID;
  const GCP_SERVICE_ACCOUNT_EMAIL = process.env.GCP_SERVICE_ACCOUNT_EMAIL;
  const GCP_WORKLOAD_IDENTITY_POOL_PROVIDER_ID =
    process.env.GCP_WORKLOAD_IDENTITY_POOL_PROVIDER_ID;
  const PUPIL_FIRESTORE_ID = process.env.PUPIL_FIRESTORE_ID;

  if (
    !GCP_PROJECT_ID ||
    !GCP_SERVICE_ACCOUNT_EMAIL ||
    !GCP_WORKLOAD_IDENTITY_POOL_PROVIDER_ID ||
    !PUPIL_FIRESTORE_ID
  ) {
    throw new Error(
      "GCP_PROJECT_ID, GCP_SERVICE_ACCOUNT_EMAIL, GCP_WORKLOAD_IDENTITY_POOL_PROVIDER_ID, PUPIL_FIRESTORE_ID are required environment variables.",
    );
  }

  try {
    const authClient = ExternalAccountClient.fromJSON({
      type: "external_account",
      audience: `//iam.googleapis.com/${GCP_WORKLOAD_IDENTITY_POOL_PROVIDER_ID}`,
      subject_token_type: "urn:ietf:params:oauth:token-type:jwt",
      token_url: "https://sts.googleapis.com/v1/token",
      service_account_impersonation_url: `https://iamcredentials.googleapis.com/v1/projects/-/serviceAccounts/${GCP_SERVICE_ACCOUNT_EMAIL}:generateAccessToken`,
      subject_token_supplier: {
        getSubjectToken: getVercelOidcToken,
      },
      scopes: ["https://www.googleapis.com/auth/datastore"],
    });

    return new Firestore({
      authClient,
      projectId: GCP_PROJECT_ID,
      databaseId: PUPIL_FIRESTORE_ID,
    });
  } catch (e) {
    console.error("getPupilFirestore authClient", e);
    console.error("getPupilFirestore authClient raw:", JSON.stringify(e));
    throw e;
  }
};
