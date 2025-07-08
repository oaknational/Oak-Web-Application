import { z } from "zod";

// Zod schema for validating redirect data
export const redirectSchema = z.object({
  incoming_path: z.string(),
  outgoing_path: z.string(),
  redirect_type: z.string().optional(),
});

// Type representing the raw data from the API (snake_case)
export type RedirectData = {
  incoming_path: string;
  outgoing_path: string;
  redirect_type?: string;
};

// Type representing the processed data in camelCase for use in the application
export type Redirect = {
  incomingPath: string;
  outgoingPath: string;
  redirectType?: string;
};
