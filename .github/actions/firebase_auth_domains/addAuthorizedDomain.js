const { writeFileSync } = require("fs");

const { google } = require("googleapis");

const addAuthorizedDomain = async ({ domain, firebaseServiceAccount }) => {
  const FILE_NAME = "./serviceAccount.json";
  writeFileSync(FILE_NAME, firebaseServiceAccount);

  // Change this to whatever you want

  // Acquire an auth client, and bind it to all future calls
  const auth = new google.auth.GoogleAuth({
    keyFile: FILE_NAME,
    scopes: ["https://www.googleapis.com/auth/cloud-platform"],
  });
  const authClient = await auth.getClient();
  google.options({ auth: authClient });

  // Get the Identity Toolkit API client
  const idToolkit = google.identitytoolkit("v3").relyingparty;

  /**
   * When calling the methods from the Identity Toolkit API, we are
   * overriding the default target URLs and payloads (that interact
   * with the v3 endpoint) so we can talk to the v2 endpoint, which is
   * what Firebase Console uses.
   */

  // Generate the request URL
  const projectId = await auth.getProjectId();
  const idToolkitConfigUrl = `https://identitytoolkit.googleapis.com/admin/v2/projects/${projectId}/config`;

  // Get current config so we can use it when we later update it
  const currentConfig = await idToolkit.getProjectConfig(undefined, {
    url: idToolkitConfigUrl,
    method: "GET",
  });

  // Update the config based on the values that already exist
  await idToolkit.setProjectConfig(undefined, {
    url: idToolkitConfigUrl,
    method: "PATCH",
    params: { updateMask: "authorizedDomains" },
    body: JSON.stringify({
      authorizedDomains: [
        ...(currentConfig.data.authorizedDomains || []),
        domain,
      ],
    }),
  });
};

module.exports = addAuthorizedDomain;
