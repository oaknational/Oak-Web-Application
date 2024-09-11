import { Client as HubspotClient } from "@hubspot/api-client";
import { NextApiRequest, NextApiResponse } from "next";
import { z } from "zod";
import { PublicSubscriptionStatus } from "@hubspot/api-client/lib/codegen/communication_preferences";

import getServerConfig from "@/node-lib/getServerConfig";

const hubspot = new HubspotClient({
  accessToken: getServerConfig("hubspotOwaAccessToken"),
});

const subscriptionRequestSchema = z.object({
  email: z.string(),
  subscriptionName: z.string(),
});
export const subscriptionResponseSchema = z.boolean();

export const getisSubscribed = (
  statuses: PublicSubscriptionStatus[],
  subscriptionName: string,
) => {
  const subscription = statuses.find((s) => s.name === subscriptionName);
  const isSubscribed = subscription?.status === "SUBSCRIBED";
  return isSubscribed;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { email, subscriptionName } = subscriptionRequestSchema.parse(req.body);
  try {
    const apiResponse =
      await hubspot.communicationPreferences.statusApi.getEmailStatus(email);

    const isSubscribed = getisSubscribed(
      apiResponse.subscriptionStatuses,
      subscriptionName,
    );

    return res.status(200).json(isSubscribed);
  } catch (error) {
    return res.status(500).json({ error: JSON.stringify(error) });
  }
}
