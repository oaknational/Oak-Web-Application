/**
 * @fileoverview
 * Authorization helpers for download endpoints.
 * Handles authentication and geo-restriction checks.
 */

import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

import { ALLOWED_REGIONS } from "@/utils/onboarding/getRegion";

type ClerkUser = NonNullable<Awaited<ReturnType<typeof currentUser>>>;

export type AuthCheckResult =
  | { authorized: true; user: ClerkUser | null }
  | { authorized: false; response: NextResponse };

/**
 * Check if a user is authorized to download resources based on
 * geo-restriction and login requirements.
 *
 * @param isGeoRestricted - Whether the resource is geo-restricted
 * @param isLoginRequired - Whether login is required to download
 * @returns Authorization result with user or error response
 */
export async function checkDownloadAuthorization(
  isGeoRestricted: boolean,
  isLoginRequired: boolean,
): Promise<AuthCheckResult> {
  if (!isGeoRestricted && !isLoginRequired) {
    return { authorized: true, user: null };
  }

  const user = await currentUser();

  if (!user) {
    return {
      authorized: false,
      response: NextResponse.json(
        { error: { message: "Authentication required" } },
        { status: 401 },
      ),
    };
  }

  if (isGeoRestricted) {
    const userRegion = user.privateMetadata?.region as string | undefined;
    const isRegionAuthorised =
      userRegion && ALLOWED_REGIONS.includes(userRegion);

    if (!isRegionAuthorised) {
      return {
        authorized: false,
        response: NextResponse.json(
          { error: { message: "Access restricted based on your location" } },
          { status: 403 },
        ),
      };
    }
  }

  return { authorized: true, user };
}
