import { clerkClient, SessionWebhookEvent, User } from "@clerk/nextjs/server";

export async function handleSessionCreatedEvent(evt: SessionWebhookEvent) {
  let client;
  let user;

  try {
    client = await clerkClient();
    user = await client.users.getUser(evt.data.user_id);
  } catch (error) {
    throw new Error("User not found");
  }

  const isTargetUser = getIsTargetUser(user);
  if (isTargetUser) {
    try {
      await client.users.updateUser(user.id, {
        unsafeMetadata: { requiresGeoLocation: true },
      });
    } catch (error) {
      throw new Error("Error updating user");
    }
  }
}

function getIsTargetUser(user: User) {
  //  if user.createdAt is between 21/07/20205 and 06/08/20205
  const createdAt = new Date(user.createdAt);
  const startDate = new Date("2025-07-21");
  const endDate = new Date("2025-08-06");
  return createdAt >= startDate && createdAt <= endDate;
}
