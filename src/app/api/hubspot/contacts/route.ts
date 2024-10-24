import { hubspotClient } from "../client";

import { createHandler } from "./createHandler";

export const GET = createHandler(hubspotClient);
