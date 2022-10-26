/* eslint-disable import/no-unresolved */
import {
  AppOptions,
  cert,
  getApp,
  getApps,
  initializeApp,
} from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getDatabase } from "firebase-admin/database";

import serverConfig from "../config/server";

const serviceAccount = JSON.parse(serverConfig.get("firebaseServiceAccount"));

const options: AppOptions = {
  credential: cert(serviceAccount),
  databaseURL: serverConfig.get("firebaseAdminDatabaseUrl"),
};

const createFirebaseAdminApp = (config: AppOptions) => {
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
      console.warn("Firebase failed to init");
    }
  }
};

const firebaseAdminApp = createFirebaseAdminApp(options);

export const firebaseAdminAuth = getAuth(firebaseAdminApp);

export const firebaseAdminDatabase = getDatabase(firebaseAdminApp);
