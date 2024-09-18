import OakError from "@/errors/OakError";

export async function getContactDetails(
  email: string,
  callback?: (contactDetails: unknown) => void,
) {
  try {
    const response = await fetch(`/api/hubspot/contacts`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });
    if (!response.ok) {
      throw new Error("Failed to fetch contact details");
    }

    const result = await response.json();
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
