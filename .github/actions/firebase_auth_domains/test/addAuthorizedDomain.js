const addAuthorizedDomain = require("../addAuthorizedDomain");

/**
 * @see https://cloud.google.com/iam/docs/service-accounts#service_account_keys
 * You will need to create a serviceAccount.js file in this directory which looks like:
module.exports = {
  type: "*",
  project_id: "*",
  private_key_id: "*",
  private_key: "*",
  client_email: "*",
  client_id: "*",
  auth_uri: "*",
  token_uri: "*",
  auth_provider_x509_cert_url: "*",
  client_x509_cert_url: "*",
};
 *
 * */
const firebaseServiceAccount = require("./serviceAccount");

(async () => {
  try {
    await addAuthorizedDomain({
      url: "https://samara-f9gw24crl-oak-national-academy.vercel.app",
      firebaseServiceAccount: JSON.stringify(firebaseServiceAccount),
    });
  } catch (err) {
    console.log("There's been an error");
    console.log(err);
  }
})();
