import OakError from "@/errors/OakError";
import handleFetchError from "@/utils/handleFetchError";
import { invariant } from "@/utils/invariant";

export async function getSubscriptionStatus(
  callback?: (status: boolean) => void,
) {
  try {
    const response = await fetch("/api/hubspot/subscription", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        subscriptionName: "School Support",
      }),
    });
    handleFetchError(response);

    const result = await response.json();

    invariant(typeof result === "boolean", "Expected response to be a boolean");

    if (callback) {
      callback(result);
    }
    return result;
  } catch (err) {
    if (err instanceof OakError) {
      throw err;
    }
    throw new OakError({
      code: "hubspot/unknown",
      originalError: err,
    });
  }
}
