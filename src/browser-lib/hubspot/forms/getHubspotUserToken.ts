import Cookies from "js-cookie";

/**
 * Retrieves 'hutk' value from cookies
 */
const getHubspotUserToken = () => {
  return Cookies.get("hubspotutk");
};

export default getHubspotUserToken;
