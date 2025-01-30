/** @todo replace with native fetch once we are using Node 18 */
const readConfigFromNetwork = async (fileUrl) => {
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

module.exports = readConfigFromNetwork;
