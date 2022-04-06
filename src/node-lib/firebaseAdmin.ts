/* eslint-disable import/no-unresolved */
import {
  AppOptions,
  cert,
  getApp,
  getApps,
  initializeApp,
} from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";

import config from "../config";

import serviceAccount from "./firebaseAdminServiceAccount";

const options: AppOptions = {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  credential: cert(serviceAccount),
  databaseURL: config.get("firebaseAdminDatabaseUrl"),
};

function createFirebaseAdminApp(config: AppOptions) {
  try {
    if (getApps().length === 0) {
      return initializeApp(config);
    } else {
      return getApp();
    }
  } catch (error) {
    /*
     * We skip the "already exists" message which is
     * not an actual error when we're hot-reloading.
     * @see https://rishi.app/blog/using-firebase-admin-with-next-js
     */
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    if (!/already exists/u.test(error.message)) {
      // @TODO bugsnag
    }
  }
}

const firebaseAdmin = getAuth(createFirebaseAdminApp(options));

export default firebaseAdmin;
