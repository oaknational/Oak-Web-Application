import { clerkSetup } from "@clerk/testing/playwright";
import { config } from "dotenv";

export default async function globalSetup() {
  config({ path: [".env.local", ".env"], quiet: true });

  const { CLERK_PUBLISHABLE_KEY, CLERK_SECRET_KEY } = process.env;

  // Visual tests run without Clerk keys; e2e specs fail at the fixture if they are missing.
  if (!CLERK_PUBLISHABLE_KEY || !CLERK_SECRET_KEY) return;

  // Keys are passed explicitly so clerkSetup can't pick up NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY.
  await clerkSetup({
    publishableKey: CLERK_PUBLISHABLE_KEY,
    secretKey: CLERK_SECRET_KEY,
    dotenv: false,
  });
}
