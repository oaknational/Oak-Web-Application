import { hubspotClient } from "../client";

import { createHandler } from "./createHandler";

export const runtime = "nodejs";
export const POST = createHandler(hubspotClient);
