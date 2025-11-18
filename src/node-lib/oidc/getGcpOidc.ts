import { getVercelOidcToken } from "@vercel/functions/oidc";

export const getGcpOidc = (scopes: string[]) => {
  const GCP_SERVICE_ACCOUNT_EMAIL = process.env.GCP_SERVICE_ACCOUNT_EMAIL;
  const GCP_WORKLOAD_IDENTITY_POOL_PROVIDER_ID =
    process.env.GCP_WORKLOAD_IDENTITY_POOL_PROVIDER_ID;

  if (!GCP_SERVICE_ACCOUNT_EMAIL || !GCP_WORKLOAD_IDENTITY_POOL_PROVIDER_ID) {
    throw new Error(
      "GCP_SERVICE_ACCOUNT_EMAIL and GCP_WORKLOAD_IDENTITY_POOL_PROVIDER_ID are required environment variables.",
    );
  }
  const authClient = {
    type: "external_account",
    audience: `//iam.googleapis.com/${GCP_WORKLOAD_IDENTITY_POOL_PROVIDER_ID}`,
    subject_token_type: "urn:ietf:params:oauth:token-type:jwt",
    token_url: "https://sts.googleapis.com/v1/token",
    service_account_impersonation_url: `https://iamcredentials.googleapis.com/v1/projects/-/serviceAccounts/${GCP_SERVICE_ACCOUNT_EMAIL}:generateAccessToken`,
    subject_token_supplier: {
      getSubjectToken: getVercelOidcToken,
    },
    scopes,
  };
  return authClient;
};
