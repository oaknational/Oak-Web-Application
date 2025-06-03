import type { useUser } from "@clerk/nextjs";

declare global {
  /**
   * Public metadata for the user
   *
   * 🚨 When removing keys or altering types be sure to deprecate and/or perform a data migration to bring
   * user data inline with the new schema
   */
  interface UserPublicMetadata {
    /**
     * The origin of the app through which the user first onboarded.
     *
     * 🚨 This should be set once by the Oak app the user first onboarded through.
     */
    sourceApp?: string;
    owa?: {
      /**
       * Indicates that the user self-identified as a teacher when onboarding.
       */
      isTeacher?: boolean;
      /**
       * Indicates that the user has been onboarded
       */
      isOnboarded?: boolean;
      /**
       * Indicates that the user is authorised to download region restricted content
       */
      isRegionAuthorised?: boolean;
    };
  }

  interface UserPrivateMetadata {
    /**
     * ISO 3166-1 alpha-2 country code the user's IP address was geo-located as being within at the time of onboarding.
     *
     * This value could be incorrect or empty if their IP is missing/incorrectly located by Cloudflare or Netlify.
     *
     * 🚨 This should be set once by the Oak app the user first onboarded through.
     */
    region?: string;
  }

  interface UserUnsafeMetadata {
    owa?: {
      /**
       * Date (in milliseconds) for the last tracked sign-in
       * This can be compared to `user.lastSignInAt.toValue()` to determine
       * if the last sign-in has been tracked for analytics
       *
       * Is set to `null` at sign-up which we use to track the sign-up event
       */
      lastTrackedSignInAt?: number | null;
    };
  }

  interface CustomJwtSessionClaims {
    sourceApp?: string;
  }
}

export type UserResource = NonNullable<ReturnType<typeof useUser>["user"]>;

type GetTokenOptions = {
  template?: string;
  organizationId?: string;
  leewayInSeconds?: number;
  skipCache?: boolean;
};
export type GetToken = (options?: GetTokenOptions) => Promise<string | null>;
