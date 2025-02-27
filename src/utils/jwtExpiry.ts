/**
 * Check if a JWT token is expiring soon based on the provided threshold.
 * If there's an error parsing the token, it will be considered as expiring.
 *
 * @param token - the JWT token to check
 * @param threshold - the threshold in seconds to consider the token as expiring
 */
const isJwtExpiring = (token: string, threshold: number): boolean => {
  try {
    const payloadBase64 = token.split(".")[1];
    if (!payloadBase64) throw new Error("Invalid token format");

    const payload = JSON.parse(atob(payloadBase64));
    const exp = payload.exp;
    if (!exp) throw new Error("Missing token expiry");

    const currentTime = Math.floor(Date.now() / 1000);
    const remainingTime = exp - currentTime;

    return remainingTime <= threshold;
  } catch (error) {
    return true;
  }
};

export { isJwtExpiring };
