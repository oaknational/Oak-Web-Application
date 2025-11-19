import { getVercelOidcToken } from "@vercel/functions/oidc";

export const getGcpOidc = (scopes: string[]) => {
  const GCP_WORKLOAD_IDENTITY_POOL_PROVIDER_ID =
    process.env.GCP_WORKLOAD_IDENTITY_POOL_PROVIDER_ID;
  const GCP_SERVICE_ACCOUNT_EMAIL = process.env.GCP_SERVICE_ACCOUNT_EMAIL;

  if (!GCP_WORKLOAD_IDENTITY_POOL_PROVIDER_ID || !GCP_SERVICE_ACCOUNT_EMAIL) {
    throw new Error(
      "GCP_WORKLOAD_IDENTITY_POOL_PROVIDER_ID and GCP_SERVICE_ACCOUNT_EMAIL are required",
    );
  }

  const externalAccountJson = {
    type: "external_account",
    audience: `//iam.googleapis.com/${GCP_WORKLOAD_IDENTITY_POOL_PROVIDER_ID}`,
    subject_token_type: "urn:ietf:params:oauth:token-type:jwt",
    token_url: "https://sts.googleapis.com/v1/token",
    service_account_impersonation_url: `https://iamcredentials.googleapis.com/v1/projects/-/serviceAccounts/${GCP_SERVICE_ACCOUNT_EMAIL}:generateAccessToken`,
    subject_token_supplier: {
      getSubjectToken: getVercelOidcToken,
    },
    // Use cloud-platform so the same token works for Firestore *and* DLP
    scopes,
  } as const;
  return externalAccountJson;
};
