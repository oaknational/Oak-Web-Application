import { auth, clerkClient } from "@clerk/nextjs/server";

export async function POST() {
  const { userId } = auth();

  if (!userId) {
    return new Response("Unauthorized", { status: 401 });
  }

  const publicMetadata = { "owa:onboarded": true };

  await clerkClient().users.updateUserMetadata(userId, {
    publicMetadata,
  });

  return Response.json(publicMetadata);
}
