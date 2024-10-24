import { Client as HubspotClient } from "@hubspot/api-client";
import { currentUser } from "@clerk/nextjs/server";
import { z } from "zod";

import { handleZodValidationErrors } from "@/node-lib/handleZodValidationErrors";

const subscriptionRequestSchema = z.object({
  subscriptionName: z.string(),
});

export function createHandler(hubspot: HubspotClient) {
  return handleZodValidationErrors(async function handler(req: Request) {
    const user = await currentUser();

    if (!user) {
      return new Response(null, { status: 401 });
    }

    const email = user.primaryEmailAddress?.emailAddress;

    if (!email) {
      return Response.json(false);
    }

    const { subscriptionName } = subscriptionRequestSchema.parse(
      await req.json(),
    );

    const apiResponse =
      await hubspot.communicationPreferences.statusApi.getEmailStatus(email);

    const subscription = apiResponse.subscriptionStatuses.find(
      (s) => s.name === subscriptionName,
    );
    const isSubscribed = subscription?.status === "SUBSCRIBED";

    return Response.json(isSubscribed);
  });
}
