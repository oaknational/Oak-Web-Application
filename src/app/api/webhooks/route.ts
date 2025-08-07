import { Webhook } from "svix";
import { headers } from "next/headers";
import { WebhookEvent } from "@clerk/nextjs/server";
import { NextRequest } from "next/server";

import { handleSessionCreatedEvent } from "@/utils/handleSessionCreatedEvent";
import getServerConfig from "@/node-lib/getServerConfig";
import { getWebhookEducatorApi } from "@/node-lib/educator-api";
import errorReporter from "@/common-lib/error-reporter";

export async function POST(req: NextRequest) {
  const signingSecret = getServerConfig("clerkSigningSecret");
  const reportError = errorReporter("webhooks");

  if (!signingSecret) {
    throw new Error(
      "Error: Please add SIGNING_SECRET from Clerk Dashboard to .env or .env",
    );
  }

  // Create new Svix instance with secret
  const wh = new Webhook(signingSecret);

  // Get headers
  const headerPayload = await headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    reportError(new Error("Missing Svix headers"));
    return new Response("Error: Missing Svix headers", {
      status: 400,
    });
  }

  const payload = await req.json();
  const body = JSON.stringify(payload);

  let evt: WebhookEvent;

  // Verify payload with headers
  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    reportError(err, {
      message: "Could not verify request headers",
    });
    return new Response("Error: Verification error", {
      status: 400,
    });
  }

  const { id } = evt.data;

  // Insert or update user in db
  if (id && evt.type === "user.updated") {
    const educatorApi = await getWebhookEducatorApi(id);
    const sourceApp = evt.data.public_metadata?.sourceApp;

    try {
      await educatorApi.createUser({ userId: id, sourceApp });
    } catch (error) {
      reportError(error, {
        message: "Failed to create user in database",
      });
      return new Response("Error: Could not create user", {
        status: 500,
      });
    }
  }
  if (id && evt.type === "session.created") {
    try {
      await handleSessionCreatedEvent(evt);
    } catch (error) {
      reportError(error, {
        message: "Failed to update requiresGeolocation",
      });
      return new Response("Error: could not update user", {
        status: 500,
      });
    }
  }
  return new Response("Webhook received", { status: 200 });
}
