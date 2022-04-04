import config from "../config";

const serviceAccount = {
  type: "service_account",
  project_id: config.get("firebaseProjectId"),
  private_key_id: config.get("firebaseAdminPrivateKeyId"),
  private_key: config.get("firebaseAdminPrivateKey"),
  client_email: config.get("firebaseAdminClientEmail"),
  client_id: config.get("firebaseAdminClientId"),
  auth_uri: "https://accounts.google.com/o/oauth2/auth",
  token_uri: "https://oauth2.googleapis.com/token",
  auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
  client_x509_cert_url: config.get("firebaseAdminX509CertUrl"),
};

export default serviceAccount;
