import getBrowserConfig from "../getBrowserConfig";

import { AvoEnv } from "./Avo";

/**
 * Avo will send a request to avo.app on init in non-production environments
 * @todo: use release stage from constants
 */
const getAvoEnv = () => {
  switch (getBrowserConfig("releaseStage")) {
    case "production":
      return AvoEnv.Prod;
    case "development":
    default:
      return AvoEnv.Dev;
  }
};

export default getAvoEnv;
