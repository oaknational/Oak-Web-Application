import type { OakConfig } from "./config_types.js";

const readConfigFromNetwork = async (fileUrl: string): Promise<OakConfig> => {
  let parsedUrl;
  try {
    parsedUrl = new URL(fileUrl).href;
  } catch (err) {
    console.error(`Invalid config URL: "${fileUrl}"`);
    throw err;
  }

  let response;
  try {
    const cacheBust = `?time=${Date.now()}`;
    response = await fetch(parsedUrl + cacheBust);
  } catch (err) {
    console.error("Failed to fetch config from network.");
    throw err;
  }

  let configJson;
  try {
    configJson = await response.json();
  } catch (err) {
    console.error(
      `Could not parse config from network into JSON object: ${response}`,
    );
    throw err;
  }

  return configJson;
};

export default readConfigFromNetwork;
