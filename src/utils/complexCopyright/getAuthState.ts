import z from "zod";

import { AuthState } from "./complexCopyright.types";

export const clerkMetadataSchema = z.object({
  owa: z
    .object({
      isRegionAuthorised: z.boolean().nullish(),
      isOnboarded: z.boolean().nullish(),
    })
    .nullish(),
});

export type ClerkMetadata = z.infer<typeof clerkMetadataSchema>;

export const getAuthState = ({
  isSignedIn,
  metadata,
}: {
  isSignedIn: boolean | undefined;
  metadata: ClerkMetadata | undefined;
}): AuthState => {
  return {
    isSignedIn: !!isSignedIn,
    isOnboarded: (isSignedIn && metadata?.owa?.isOnboarded) ?? false,
    isRegionAuthorised: metadata?.owa?.isRegionAuthorised !== false,
  };
};
