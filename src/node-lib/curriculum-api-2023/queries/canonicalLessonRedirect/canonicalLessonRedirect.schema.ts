import { z } from "zod";

// Zod schema for validating redirect data
export const redirectSchema = z.object({
  incoming_path: z.string(),
  outgoing_path: z.string(),
  redirect_type: z.union([
    z.literal(301),
    z.literal(302),
    z.literal(303),
    z.literal(307),
    z.literal(308),
  ]),
});

// Type representing the raw data from the API (snake_case)
export type RedirectData = {
  incoming_path: string;
  outgoing_path: string;
  redirect_type?: 301 | 302 | 303 | 307 | 308;
};

// Type representing the processed data in camelCase for use in the application
export type Redirect = {
  incomingPath: string;
  outgoingPath: string;
  redirectType: 301 | 302 | 303 | 307 | 308;
};
