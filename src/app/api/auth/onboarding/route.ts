import { auth, clerkClient } from "@clerk/nextjs/server";
import { ZodError } from "zod";

import { onboardingSchema } from "@/common-lib/schemas/onboarding";

export async function POST(req: Request) {
  const { userId } = auth();

  if (!userId) {
    return new Response("Unauthorized", { status: 401 });
  }

  try {
    const data = onboardingSchema.parse(await req.json());

    const publicMetadata = { ...data, "owa:onboarded": true };

    await clerkClient().users.updateUserMetadata(userId, {
      publicMetadata,
    });

    return Response.json(publicMetadata);
  } catch (error) {
    if (error instanceof ZodError) {
      return Response.json(error.format(), { status: 400 });
    }

    throw error;
  }
}
