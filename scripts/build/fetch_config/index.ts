import path from "node:path";

import type { OakConfig } from "./config_types";
import readConfigFromFile from "./read_from_fs";
import readConfigFromNetwork from "./read_from_network";

/**
 * Given a file or network location of a JSON config file, read and return a promise for it.
 * @param location The file or network location of the config file. Defaults to oak.config.json .
 * @returns An Oak config object
 *
 * @todo validate the config after fetching.
 */
const fetchConfig = async (location: string): Promise<OakConfig> => {
  if (location && typeof location !== "string") {
    throw new TypeError("`location` must be supplied as a string.");
  }

  // Determine if local or remote config.
  const isNetworkLocation = location && location.startsWith("http");

  let config: OakConfig;

  if (isNetworkLocation) {
    const fileUrl = location;
    config = await readConfigFromNetwork(fileUrl);
  } else {
    // Default path to config file, relative to this file.
    const defaultFileLocation = "../../../oak-config/oak.config.json";
    const filePath = location
      ? location
      : path.resolve(__dirname, defaultFileLocation);
    config = await readConfigFromFile(filePath);
  }

  return config;
};

export default fetchConfig;

/**
 * # OAK
 NEXT_PUBLIC_APP_VERSION = "123"; # DYNAMIC
 NEXT_PUBLIC_RELEASE_STAGE = "test"; # DYNAMIC
 NEXT_PUBLIC_CLIENT_APP_BASE_URL="http://localhost:3000"

# BUGSNAG

NEXT_PUBLIC_BUGSNAG_API_KEY="NEXT_PUBLIC_BUGSNAG_API_KEY"

# BROWSERSTACK
BROWSERSTACK_ACCESS_KEY="pass" #SECRET
 */
