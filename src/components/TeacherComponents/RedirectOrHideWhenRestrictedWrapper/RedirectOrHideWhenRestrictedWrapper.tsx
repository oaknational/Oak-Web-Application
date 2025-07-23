import { SignUpButton } from "@clerk/nextjs";
import { useRouter } from "next/router";

/**
 * RedirectOrHideWhenRestrictedWrapper
 *
 * A wrapper component that conditionally renders its children based on content restriction and geo-blocking.
 *
 * - If `showGeoBlocked` is true, renders nothing (hides children).
 * - If `contentRestricted` is true, wraps children in a Clerk SignUpButton, redirecting to the current path after sign up.
 * - Otherwise, renders children as-is.
 * - Must strip href and and click handlers from the child for this to work correctly
 *
 * @example
 * <RedirectOrHideWhenRestrictedWrapper
 *   contentRestricted={contentRestricted}
 *   showGeoBlocked={isGeoBlocked}
 * >
 *   <SomeComponent
 *    href={contentRestricted ? undefined : href}
 *    handleClick={contentRestricted ? undefined : () => handleClick()}
 *  />
 * </RedirectOrHideWhenRestrictedWrapper>
 */
function RedirectOrHideWhenRestrictedWrapper({
  children,
  contentRestricted,
  showGeoBlocked,
}: {
  /**
   * The React node(s) to render or wrap.
   */
  children: React.ReactNode;
  /**
   * If true, wraps children in a Clerk SignUpButton.
   */
  contentRestricted: boolean;
  /**
   * If true, hides children (renders nothing).
   */
  showGeoBlocked: boolean;
}) {
  const router = useRouter();

  if (showGeoBlocked) return null;

  if (contentRestricted) {
    return (
      <SignUpButton forceRedirectUrl={router.asPath}>{children}</SignUpButton>
    );
  }

  return <>{children}</>;
}

export default RedirectOrHideWhenRestrictedWrapper;
