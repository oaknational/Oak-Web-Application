import { Client as HubspotClient } from "@hubspot/api-client";
import { NextApiRequest, NextApiResponse } from "next";
import { z } from "zod";
import { PublicSubscriptionStatus } from "@hubspot/api-client/lib/codegen/communication_preferences";
import { clerkClient, getAuth } from "@clerk/nextjs/server";

import getServerConfig from "@/node-lib/getServerConfig";

const subscriptionRequestSchema = z.object({
  subscriptionName: z.string(),
});

const getIsSubscribed = (
  statuses: PublicSubscriptionStatus[],
  subscriptionName: string,
) => {
  const subscription = statuses.find((s) => s.name === subscriptionName);
  const isSubscribed = subscription?.status === "SUBSCRIBED";
  return isSubscribed;
};

export function createHandler(hubspot: HubspotClient) {
  return async function handler(req: NextApiRequest, res: NextApiResponse) {
    const auth = getAuth(req);

    if (!auth.userId) {
      return res.status(401).send("Unauthorized");
    }

    const client = await clerkClient();

    const email = (await client.users.getUser(auth.userId)).primaryEmailAddress
      ?.emailAddress;

    if (!email) {
      return res.status(200).json(false);
    }

    const { subscriptionName } = subscriptionRequestSchema.parse(req.body);
    try {
      const apiResponse =
        await hubspot.communicationPreferences.statusApi.getEmailStatus(email);

      const isSubscribed = getIsSubscribed(
        apiResponse.subscriptionStatuses,
        subscriptionName,
      );

      return res.status(200).json(isSubscribed);
    } catch (error) {
      return res.status(500).json({ error: JSON.stringify(error) });
    }
  };
}

export default createHandler(
  new HubspotClient({
    accessToken: getServerConfig("hubspotOwaAccessToken"),
  }),
);
