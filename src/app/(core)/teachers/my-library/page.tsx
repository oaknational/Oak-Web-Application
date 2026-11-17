import { Metadata } from "next";
import { Suspense } from "react";
import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";

import { MyLibraryContent } from "./MyLibraryContent";

import { getOpenGraphMetadata, getTwitterMetadata } from "@/app/metadata";
import { resolveOakHref } from "@/common-lib/urls";
import { clerkMetadataSchema } from "@/utils/complexCopyright/getAuthState";

const title = "My library";
const description = "Save units to your own personal library";

export const metadata: Metadata = {
  title,
  description,
  robots: {
    index: false,
    follow: false,
  },
  openGraph: getOpenGraphMetadata({ title, description }),
  twitter: getTwitterMetadata({ title, description }),
};

const MyLibraryPage = async () => {
  const returnTo = resolveOakHref({ page: "my-library" });
  const { userId, isAuthenticated, getToken, redirectToSignUp, sessionClaims } =
    await auth();

  if (!isAuthenticated) {
    return redirectToSignUp({ returnBackUrl: returnTo });
  }

  const metadata = clerkMetadataSchema.safeParse(sessionClaims)?.data;

  if (!metadata?.owa?.isOnboarded) {
    redirect(
      `${resolveOakHref({ page: "onboarding" })}?returnTo=${encodeURIComponent(returnTo)}`,
    );
  }

  return (
    <Suspense>
      <MyLibraryContent getToken={getToken} userId={userId} />
    </Suspense>
  );
};

export default MyLibraryPage;
