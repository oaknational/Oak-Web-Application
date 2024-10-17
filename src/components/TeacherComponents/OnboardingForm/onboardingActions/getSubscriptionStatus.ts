import OakError from "@/errors/OakError";
import { subscriptionResponseSchema } from "@/pages/api/hubspot/subscription";

export async function getSubscriptionStatus(
  email: string,
  callback?: (status: boolean) => void,
) {
  try {
    const response = await fetch("/api/hubspot/subscription", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        subscriptionName: "School Support",
      }),
    });
    const result = subscriptionResponseSchema.parse(await response.json());
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
