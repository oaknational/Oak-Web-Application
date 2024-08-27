export {};

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
    /**
     * ISO 3166-1 alpha-2 country code the user's IP address was geo-located as being within at the time of onboarding.
     *
     * This value could be incorrect or set to a value of XX if their IP is missing/incorrectly located by Cloudflare.
     *
     * 🚨 This should be set once by the Oak app the user first onboarded through.
     */
    region?: string;
    owa?: {
      /**
       * Indicates that the user self-identified as a teacher when onboarding.
       */
      isTeacher?: boolean;
      /**
       * Indicates that the user has been onboarded
       */
      isOnboarded?: boolean;
    };
  }
}
