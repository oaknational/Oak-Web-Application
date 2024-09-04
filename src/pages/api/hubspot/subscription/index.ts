import { Client as HubspotClient } from "@hubspot/api-client";
import { NextApiRequest, NextApiResponse } from "next";
import { z } from "zod";

import getServerConfig from "@/node-lib/getServerConfig";

const hubspot = new HubspotClient({
  accessToken: getServerConfig("hubspotOwaAccessToken"),
});

const subscriptionRequestSchema = z.object({
  email: z.string(),
  subscriptionName: z.string(),
});
export const subscriptionResponseSchema = z.boolean();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { email, subscriptionName } = subscriptionRequestSchema.parse(req.body);
  try {
    const apiResponse =
      await hubspot.communicationPreferences.statusApi.getEmailStatus(email);

    const subscription = apiResponse.subscriptionStatuses.find(
      (s) => s.name === subscriptionName,
    );
    const isSubscribed = subscription?.status === "SUBSCRIBED";

    return res.status(200).json(isSubscribed);
  } catch (error) {
    return res.status(500).json({ error: JSON.stringify(error) });
  }
}
